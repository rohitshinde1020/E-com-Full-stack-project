const Product = require('../models/productModel.js');
const cloudinary = require('cloudinary').v2;

const addproduct = async (req, res) => {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    try {
        if (!name || !description || price === undefined || !category || !subCategory) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
        }

        const image1 = req.files?.image1 && req.files.image1[0];
        const image2 = req.files?.image2 && req.files.image2[0];
        const image3 = req.files?.image3 && req.files.image3[0];
        const image4 = req.files?.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter(image => image !== undefined);

        if (images.length === 0) {
            return res.status(400).json({ success: false, message: 'Please upload at least one image.' });
        }

        const imageUrls = await Promise.all(
            images.map(async (items) => {
                const result = await cloudinary.uploader.upload(items.path, { resource_type: 'auto' });
                return result.secure_url;
            })
        );

        let parsedSizes = [];
        if (Array.isArray(sizes)) {
            parsedSizes = sizes;
        } else if (typeof sizes === 'string') {
            parsedSizes = JSON.parse(sizes);
        }

        if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide at least one size.' });
        }

        const newProduct = new Product({
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            bestseller: typeof bestseller === 'boolean' ? bestseller : String(bestseller).trim().toLowerCase() === 'true',
            sizes: parsedSizes,
            image: imageUrls,
            date: Date.now()
        });


        await newProduct.save();
        res.status(201).json({ success: true, message: 'Product added successfully!' });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};

const listproducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ success: true, products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};

const removeproduct = async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        res.json({ success: true, message: 'Product removed successfully!' });
    } catch (error) {
        console.error('Error removing product:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};

const singleproduct = async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        res.json({ success: true, product });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};

module.exports = {
    addproduct,
    listproducts,
    removeproduct,
    singleproduct
};