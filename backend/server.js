require('dotenv').config();
const app = require('./app.js');
const connectDB = require('./config/db.js');
const connectcloudinary = require('./config/cloudinary.js');

const PORT = process.env.PORT || 3000;

const requiredEnv = ['MONGO_URI', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
    console.error(`Missing required environment variables: ${missingEnv.join(', ')}`);
    process.exit(1);
}

const startServer = async () => {
    try {
        await connectDB();
        await connectcloudinary();

        app.listen(PORT, () => {
            console.log(`API server listening on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
