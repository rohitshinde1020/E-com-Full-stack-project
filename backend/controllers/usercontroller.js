const { JsonWebTokenError } = require('jsonwebtoken');
const user = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const createtoken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
        }

        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);
        const newUser = new user({
            name,
            email,
            password: hashpassword
        });
        await newUser.save();

        const token = createtoken({ id: newUser._id, role: 'user' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            token,
            user: {
                name: newUser.name,
                email: newUser.email,
            }
        });

    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }


}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
        }

        const existingUser = await user.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const token = createtoken({ id: existingUser._id, role: 'user' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000
        });

        res.json({
            success: true,
            message: 'User logged in successfully!',
            token,
            user: {
                name: existingUser.name,
                email: existingUser.email,
            }
        });
    }
    catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
}



const adminlogin = async (req, res) => {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    if (email === adminEmail && password === adminPassword) {
        const token = createtoken({ id: email, role: 'admin' });
        res.json({ success: true, message: 'Admin logged in successfully!', token });
    } else {
        res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }
};


module.exports = {
    registerUser,
    loginUser,
    adminlogin,
}
