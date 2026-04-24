require('dotenv').config();
const connectDB = require('../config/db.js');
const connectcloudinary = require('../config/cloudinary.js');
const app = require('../app.js');

let isInitialized = false;
let initError = null;

const initialize = async () => {
    try {
        await connectDB();
        await connectcloudinary();
        isInitialized = true;
    } catch (error) {
        initError = error;
        console.error('Failed to initialize server dependencies:', error.message);
    }
};

// Kick off initialization immediately (warm up on first import)
const initPromise = initialize();

module.exports = async (req, res) => {
    // Wait for initialization to complete before handling requests
    await initPromise;

    if (initError) {
        return res.status(500).json({
            success: false,
            message: 'Server failed to initialize. Please check server logs.',
        });
    }

    return app(req, res);
};

