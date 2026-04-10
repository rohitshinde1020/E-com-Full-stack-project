require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userrouter = require('./routers/userrouter.js');
const productrouter = require('./routers/productrouter.js');
const cartrouter = require('./routers/cartrouter.js');
const orderrouter = require('./routers/orderrouter.js');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.json({ success: true, message: 'E-Com API is running' });
});

app.get('/health', (req, res) => {
    res.json({ success: true, uptime: process.uptime(), timestamp: Date.now() });
});

app.use('/api/users', userrouter);
app.use('/api/products', productrouter);
app.use('/api/cart', cartrouter);
app.use('/api/orders', orderrouter);

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((error, req, res, next) => {
    console.error('Unhandled error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

module.exports = app;

