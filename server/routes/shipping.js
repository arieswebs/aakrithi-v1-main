import express from 'express';

const router = express.Router();

let cachedToken = null;
let tokenExpiry = null;

async function getShiprocketToken() {
    const now = Date.now();
    // Cache the token for 9 days since it expires in 10 days
    if (cachedToken && tokenExpiry && now < tokenExpiry) {
        return cachedToken;
    }

    const email = process.env.SHIPROCKET_EMAIL;
    const password = process.env.SHIPROCKET_PASSWORD;

    if (!email || !password) {
        console.error('Shiprocket credentials missing in environment variables');
        return null;
    }

    try {
        const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (!res.ok) {
            const errText = await res.text();
            console.error('Shiprocket login failed:', errText);
            return null;
        }

        const data = await res.json();
        if (data && data.token) {
            cachedToken = data.token;
            // Token expires in 10 days, cache for 9 days
            tokenExpiry = now + 9 * 24 * 60 * 60 * 1000;
            return cachedToken;
        }
        return null;
    } catch (err) {
        console.error('Shiprocket login exception:', err);
        return null;
    }
}

// GET pincode checker
router.get('/check-pincode', async (req, res) => {
    try {
        const pincode = req.query.pincode;
        const type = req.query.type || 'retail';

        if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
            return res.status(400).json({ success: false, message: 'Invalid pincode format.' });
        }

        const token = await getShiprocketToken();
        if (!token) {
            return res.json({ 
                success: false, 
                message: 'Shipping service is currently unavailable. Please try again later.' 
            });
        }

        const pickupPincode = process.env.SHIPROCKET_ORIGIN_PINCODE || '682001';
        const weight = type === 'wholesale' ? 5.0 : 0.5;
        // 1 represents COD, 0 prepaid. We check with 1 to see if courier supports COD.
        const cod = 1; 

        const queryParams = new URLSearchParams({
            pickup_postcode: pickupPincode,
            delivery_postcode: pincode,
            weight: weight.toString(),
            cod: cod.toString()
        });

        const fetchRes = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/serviceability/?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const responseData = await fetchRes.json();

        // Shiprocket returns 404 or a status code of 404 when postcode is unserviceable
        if (fetchRes.status === 404 || (responseData && responseData.status === 404)) {
            return res.json({
                success: false,
                message: 'Currently, we do not deliver to this pincode. We are expanding quickly!',
                is_b2b_fail: type === 'wholesale'
            });
        }

        if (responseData && responseData.status === 200 && responseData.data && responseData.data.available_courier_companies) {
            const couriers = responseData.data.available_courier_companies;
            if (couriers.length > 0) {
                // By default, Shiprocket recommends the fastest courier at index 0
                const bestCourier = couriers[0];
                const etd = bestCourier.etd;
                const codAvailable = bestCourier.cod === 1;

                let message = `Delivery available by <strong>${etd}</strong>.`;
                if (type === 'wholesale') {
                    message = `Express Wholesale Logistics available.<br>Estimated transit: <strong>${etd}</strong>.`;
                } else if (codAvailable) {
                    message += `<br>Cash on Delivery is eligible.`;
                }

                return res.json({
                    success: true,
                    message,
                    etd,
                    cod: codAvailable
                });
            }
        }

        return res.json({
            success: false,
            message: 'Serviceability could not be determined for this pincode.'
        });

    } catch (error) {
        console.error('Shiprocket serviceability error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Unable to verify pincode at this time.' 
        });
    }
});

export default router;
