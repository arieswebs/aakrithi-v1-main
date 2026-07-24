import express from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma.js';

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, password_confirmation } = req.body;

        if (!name || !email || !password || !password_confirmation) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        if (password !== password_confirmation) {
            return res.status(400).json({ success: false, message: 'Passwords do not match.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
        }

        // Check if user already exists
        const existingUser = await prisma.users.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in PostgreSQL
        const newUser = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
                is_admin: false,
                created_at: new Date(),
                updated_at: new Date()
            }
        });

        return res.json({
            success: true,
            user: {
                id: newUser.id.toString(),
                name: newUser.name,
                email: newUser.email,
                is_admin: newUser.is_admin
            }
        });

    } catch (error) {
        console.error('Registration API error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        // Find user by email
        const user = await prisma.users.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        // Compare password (bcryptjs natively handles Laravel's $2y$ prefix hashes)
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        return res.json({
            success: true,
            user: {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                is_admin: user.is_admin
            }
        });

    } catch (error) {
        console.error('Login API error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

export default router;
