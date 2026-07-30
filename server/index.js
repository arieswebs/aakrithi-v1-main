import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import route modules
import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';
import shippingRouter from './routes/shipping.js';
import checkoutRouter from './routes/checkout.js';
import ordersRouter from './routes/orders.js';
import userRouter from './routes/user.js';
import adminRouter from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/shipping', shippingRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/order', ordersRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);

// Serve static assets in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// For SPA routing fallback: send index.html for all non-api routes
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
});

// Start Express Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express server running on port ${PORT}`);
});
