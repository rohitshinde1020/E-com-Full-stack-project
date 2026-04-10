require('dotenv').config();
const connectDB = require('../config/db.js');
const connectcloudinary = require('../config/cloudinary.js');
const app = require('../app.js');

let isInitialized = false;

module.exports = async (req, res) => {
    if (!isInitialized) {
        await connectDB();
        await connectcloudinary();
        isInitialized = true;
    }

    return app(req, res);
};
