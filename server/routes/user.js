import express from 'express';
import { prisma } from '../../lib/prisma.js';

const router = express.Router();

// GET saved user addresses
router.get('/addresses', async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.json({ success: false, addresses: [] });
        }

        const dbAddresses = await prisma.user_addresses.findMany({
            where: {
                user_id: BigInt(userId)
            },
            orderBy: {
                is_default: 'desc'
            }
        });

        // Serialize BigInt ID values
        const addresses = dbAddresses.map(addr => ({
            id: addr.id.toString(),
            name: addr.name,
            email: addr.email,
            phone: addr.phone,
            address: addr.address,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            is_default: addr.is_default
        }));

        return res.json({ success: true, addresses });

    } catch (error) {
        console.error('Error fetching user addresses:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch addresses.' });
    }
});

// POST add shipping address
router.post('/addresses/add', async (req, res) => {
    try {
        const { userId, name, email, phone, address, city, state, pincode, is_default } = req.body;

        if (!userId || !name || !email || !phone || !address || !city || !state || !pincode) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const uId = BigInt(userId);

        // If this address is set as default, clear other default addresses first
        if (is_default) {
            await prisma.user_addresses.updateMany({
                where: { user_id: uId },
                data: { is_default: false }
            });
        }

        // Check if user has no addresses yet. If so, make this default anyway
        const addressCount = await prisma.user_addresses.count({
            where: { user_id: uId }
        });

        const newAddress = await prisma.user_addresses.create({
            data: {
                user_id: uId,
                name,
                email,
                phone,
                address,
                city,
                state,
                pincode,
                is_default: addressCount === 0 ? true : Boolean(is_default),
                created_at: new Date(),
                updated_at: new Date()
            }
        });

        return res.json({
            success: true,
            address: {
                id: newAddress.id.toString(),
                name: newAddress.name,
                email: newAddress.email,
                phone: newAddress.phone,
                address: newAddress.address,
                city: newAddress.city,
                state: newAddress.state,
                pincode: newAddress.pincode,
                is_default: newAddress.is_default
            }
        });

    } catch (error) {
        console.error('Error saving user address:', error);
        return res.status(500).json({ success: false, message: 'Failed to save address.' });
    }
});

// POST delete address
router.post('/addresses/delete', async (req, res) => {
    try {
        const { addressId, userId } = req.body;

        if (!addressId || !userId) {
            return res.status(400).json({ success: false, message: 'Address ID and User ID are required.' });
        }

        const addrId = BigInt(addressId);
        const uId = BigInt(userId);

        // Find the address first to check ownership and default status
        const address = await prisma.user_addresses.findUnique({
            where: { id: addrId }
        });

        if (!address || address.user_id.toString() !== userId.toString()) {
            return res.status(404).json({ success: false, message: 'Address not found or unauthorized.' });
        }

        // Delete the address
        await prisma.user_addresses.delete({
            where: { id: addrId }
        });

        // If the deleted address was default, set another address as default if available
        if (address.is_default) {
            const nextAddr = await prisma.user_addresses.findFirst({
                where: { user_id: uId }
            });

            if (nextAddr) {
                await prisma.user_addresses.update({
                    where: { id: nextAddr.id },
                    data: { is_default: true }
                });
            }
        }

        return res.json({ success: true, message: 'Address deleted successfully.' });

    } catch (error) {
        console.error('Error deleting user address:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete address.' });
    }
});

// GET user orders
router.get('/orders', async (req, res) => {
    try {
        const email = req.query.email;

        if (!email) {
            return res.json({ success: false, orders: [] });
        }

        const dbOrders = await prisma.orders.findMany({
            where: {
                customer_email: {
                    equals: email,
                    mode: 'insensitive'
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        // Serialize BigInt and Decimal types for JSON transmission
        const orders = dbOrders.map(order => ({
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
        }));

        return res.json({ success: true, orders });

    } catch (error) {
        console.error('Error fetching user orders:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
    }
});

export default router;
