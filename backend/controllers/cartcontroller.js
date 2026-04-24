const user = require('../models/userModel.js');
const product = require('../models/productModel.js');

const addtocart = async (req, res) => {
    try {
        const { productId, size, quantity } = req.body;
        const userId = req.body.userId; // From verified token (middleware)

        // Validation
        if (!productId || !size || !quantity) {
            return res.status(400).json({ success: false, message: 'Product ID, size, and quantity are required' });
        }

        if (quantity <= 0) {
            return res.status(400).json({ success: false, message: 'Quantity must be greater than 0' });
        }

        const userdata = await user.findById(userId);
        if (!userdata) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const productdata = await product.findById(productId);
        if (!productdata) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const cartdata = userdata.cartdata || {};

        if (cartdata[productId]) {
            if (cartdata[productId][size]) {
                cartdata[productId][size] += quantity;
            }

            else {
                cartdata[productId][size] = quantity;
            }
        }
        else {
            cartdata[productId] = { [size]: quantity };
        }

        const updatedUser = await user.findByIdAndUpdate(userId, { cartdata });
        res.status(200).json({ success: true, message: 'Item added to cart', cartdata });
    }
    catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};

const updatecart = async (req, res) => {
    try {
        const { productId, size, quantity } = req.body;
        const userId = req.body.userId; // From verified token (middleware)

        // Validation
        if (!productId || !size || quantity === undefined) {
            return res.status(400).json({ success: false, message: 'Product ID, size, and quantity are required' });
        }

        if (quantity < 0) {
            return res.status(400).json({ success: false, message: 'Quantity cannot be negative' });
        }

        const userdata = await user.findById(userId);
        if (!userdata) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const cartdata = userdata.cartdata;
        if (!cartdata || !cartdata[productId] || !cartdata[productId][size]) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

        if (quantity > 0) {
            cartdata[productId][size] = quantity;
        } else {
            // Delete the size
            delete cartdata[productId][size];

            // If no sizes left, delete the product entirely
            if (Object.keys(cartdata[productId]).length === 0) {
                delete cartdata[productId];
            }
        }

        const updatedUser = await user.findByIdAndUpdate(userId, { cartdata });
        res.status(200).json({ success: true, message: 'Cart updated successfully', cartdata });
    }
    catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};

const getusercart = async (req, res) => {
    try {
        const userId = req.body.userId; // From verified token (middleware)

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const userdata = await user.findById(userId);
        if (!userdata) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, cartdata: userdata.cartdata || {} });
    }
    catch (error) {
        console.error('Error fetching user cart:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};

module.exports = { addtocart, updatecart, getusercart }