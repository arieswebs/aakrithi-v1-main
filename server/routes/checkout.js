import express from 'express';
import { prisma } from '../../lib/prisma.js';
import Razorpay from 'razorpay';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { cart } = req.body;

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty.' });
        }

        // Fetch products from database to securely verify prices
        const productIds = cart.map(item => BigInt(item.product_id));
        
        const dbProducts = await prisma.products.findMany({
            where: {
                id: { in: productIds }
            }
        });

        // Compute total amount based on database prices to prevent client-side manipulation
        let total = 0;
        for (const item of cart) {
            const dbProduct = dbProducts.find(p => p.id.toString() === item.product_id);
            if (dbProduct) {
                total += Number(dbProduct.price) * item.quantity;
            } else {
                return res.status(400).json({ 
                    success: false, 
                    message: `Product ${item.name || 'ID ' + item.product_id} is no longer available.` 
                });
            }
        }

        const razorpayKey = process.env.RAZORPAY_KEY_ID;
        const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!razorpayKey || !razorpaySecret) {
            console.error('Razorpay credentials missing in env variables.');
            return res.status(500).json({ 
                success: false, 
                message: 'Payment gateway configuration is missing.' 
            });
        }

        // Initialize Razorpay client
        const razorpay = new Razorpay({
            key_id: razorpayKey,
            key_secret: razorpaySecret
        });

        // Create Razorpay Order (amount in paise, so multiply by 100)
        const amountInPaise = Math.round(total * 100);
        const receipt = `rcpt_${Math.random().toString(36).substring(2, 15)}`;

        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: 'INR',
            receipt: receipt
        });

        return res.json({
            success: true,
            razorpayOrderId: order.id,
            total,
            razorpayKey
        });

    } catch (error) {
        console.error('Razorpay Order API error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to create payment order. ' + error.message 
        });
    }
});

export default router;
