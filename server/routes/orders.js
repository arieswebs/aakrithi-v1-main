import express from 'express';
import crypto from 'crypto';
import { prisma } from '../../lib/prisma.js';

const router = express.Router();

// GET single order details by orderNumber
router.get('/details/:orderNumber', async (req, res) => {
    try {
        const { orderNumber } = req.params;

        const order = await prisma.orders.findUnique({
            where: { order_number: orderNumber }
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        // Serialize BigInt and Decimal fields
        const serializedOrder = {
            id: order.id.toString(),
            order_number: order.order_number,
            customer_name: order.customer_name,
            customer_email: order.customer_email,
            customer_phone: order.customer_phone,
            shipping_address: order.shipping_address,
            city: order.city,
            state: order.state,
            pincode: order.pincode,
            payment_method: order.payment_method,
            payment_id: order.payment_id,
            status: order.status,
            payment_status: order.payment_status,
            total: Number(order.total),
            items: Array.isArray(order.items) ? order.items : [],
            created_at: order.created_at ? order.created_at.toISOString() : new Date().toISOString()
        };

        return res.json({
            success: true,
            order: serializedOrder
        });

    } catch (error) {
        console.error('Error fetching order details:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// POST place order (called after Razorpay payment success)
router.post('/place', async (req, res) => {
    try {
        const {
            customer_name,
            customer_email,
            customer_phone,
            address_line_1,
            address_line_2,
            city,
            state,
            pincode,
            save_address,
            payment_method,
            payment_id,
            razorpay_signature,
            razorpay_order_id,
            cart,
            user_id
        } = req.body;

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty.' });
        }

        // Fetch products from database to securely calculate the total price
        const productIds = cart.map(item => BigInt(item.product_id));
        const dbProducts = await prisma.products.findMany({
            where: {
                id: { in: productIds }
            }
        });

        let total = 0;
        const serializedItems = [];
        for (const item of cart) {
            const dbProduct = dbProducts.find(p => p.id.toString() === item.product_id);
            if (dbProduct) {
                const itemTotal = Number(dbProduct.price) * item.quantity;
                total += itemTotal;
                serializedItems.push({
                    name: dbProduct.name,
                    quantity: item.quantity,
                    price: Number(dbProduct.price),
                    image: dbProduct.image,
                    category: dbProduct.category,
                    size: item.size || 'Free Size'
                });
            } else {
                return res.status(400).json({ success: false, message: `Product ${item.name} not found.` });
            }
        }

        // Verify Razorpay payment signature
        let paymentStatus = 'pending';
        if (payment_method === 'razorpay' && payment_id && razorpay_signature && razorpay_order_id) {
            const keySecret = process.env.RAZORPAY_KEY_SECRET;
            if (keySecret) {
                const expectedSignature = crypto
                    .createHmac('sha256', keySecret)
                    .update(razorpay_order_id + '|' + payment_id)
                    .digest('hex');

                if (expectedSignature === razorpay_signature) {
                    paymentStatus = 'verified';
                } else {
                    console.error('Razorpay signature verification failed.', {
                        payment_id,
                        razorpay_order_id
                    });
                }
            } else {
                console.error('Razorpay key secret is not configured.');
            }
        }

        // Generate unique order number (AAK- + 8 alphanumeric uppercase characters)
        const orderNumber = 'AAK-' + Math.random().toString(36).substring(2, 10).toUpperCase();

        const shippingAddress = address_line_1 + (address_line_2 ? ', ' + address_line_2 : '');

        // Save order to Supabase
        const newOrder = await prisma.orders.create({
            data: {
                order_number: orderNumber,
                customer_name,
                customer_email,
                customer_phone,
                shipping_address: shippingAddress,
                city,
                state,
                pincode,
                payment_method,
                payment_id,
                payment_status: paymentStatus,
                razorpay_signature,
                status: 'confirmed',
                items: serializedItems,
                total: total,
                created_at: new Date(),
                updated_at: new Date()
            }
        });

        // Save address to user_addresses if save_address checkbox was checked and user is logged in
        if (user_id && save_address) {
            const uId = BigInt(user_id);
            const addressExists = await prisma.user_addresses.findFirst({
                where: {
                    user_id: uId,
                    address: shippingAddress,
                    pincode: pincode
                }
            });

            if (!addressExists) {
                const defaultCount = await prisma.user_addresses.count({
                    where: { user_id: uId }
                });

                await prisma.user_addresses.create({
                    data: {
                        user_id: uId,
                        name: customer_name,
                        email: customer_email,
                        phone: customer_phone,
                        address: shippingAddress,
                        city,
                        state,
                        pincode,
                        is_default: defaultCount === 0,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                });
            }
        }

        return res.json({
            success: true,
            order_number: newOrder.order_number,
            order_id: newOrder.id.toString()
        });

    } catch (error) {
        console.error('Order placement API error:', error);
        return res.status(500).json({ success: false, message: 'Failed to place order.' });
    }
});

export default router;
