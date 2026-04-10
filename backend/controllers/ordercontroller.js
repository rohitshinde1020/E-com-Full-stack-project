const crypto = require('crypto');
const Razorpay = require('razorpay');
const order=require('../models/orderModel.js');
const user = require('../models/userModel.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const placeorderCOD=async(req,res)=>{
    try {
        const { items, amount, address, paymentmethod } = req.body;
        const userId = req.body.userId; // From verified token (middleware)

        if (!userId || !Array.isArray(items) || items.length === 0 || !amount || !address || !paymentmethod) {
            return res.status(400).json({ success: false, message: 'Missing required order fields.' });
        }

        const newOrder = new order({
            userId,
            items,
            amount,
            address,
            paymentmethod,
            date: Date.now()
        });

        await newOrder.save();
        res.status(201).json({ success: true, message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error placing order', error: error.message });
    }
};

// For Stripe integration
const placeorderstripe=async(req,res)=>{
    const { items, amount, address, paymentmethod } = req.body;
    const userId = req.body.userId; // From verified token (middleware)

    try {
        if (!userId || !Array.isArray(items) || items.length === 0 || !amount || !address || !paymentmethod) {
            return res.status(400).json({ success: false, message: 'Missing required order fields.' });
        }

        const newOrder = new order({
            userId,
            items,
            amount,
            address,
            paymentmethod,
            date: Date.now()
        });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const lineItems = items.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name || 'Product',
                },
                unit_amount: Math.round(Number(item.price || 0) * 100),
            },
            quantity: Number(item.quantity || 1),
        }));

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: lineItems,
            success_url: `${frontendUrl}/placeorder?stripe_success=1&orderId=${newOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontendUrl}/placeorder?stripe_canceled=1&orderId=${newOrder._id}`,
            metadata: {
                orderId: String(newOrder._id),
                userId: String(userId),
            },
        });

        newOrder.stripeSessionId = session.id;
        await newOrder.save();

        res.status(201).json({
            success: true,
            message: 'Stripe checkout session created.',
            order: newOrder,
            sessionUrl: session.url,
            sessionId: session.id,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error placing order', error: error.message });
    }
};



// For Razorpay integration
const placeorderRazorpay=async(req,res)=>{
    try {
        const { items, amount, address, paymentmethod } = req.body;
        const userId = req.body.userId; // From verified token (middleware)

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({
                success: false,
                message: 'Razorpay keys are missing on server. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
            });
        }

        if (!userId || !Array.isArray(items) || items.length === 0 || !amount || !address || !paymentmethod) {
            return res.status(400).json({ success: false, message: 'Missing required order fields.' });
        }

        const newOrder = new order({
            userId,
            items,
            amount,
            address,
            paymentmethod,
            date: Date.now()
        });

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(Number(amount) * 100),
            currency: 'INR',
            receipt: String(newOrder._id),
            notes: {
                orderId: String(newOrder._id),
                userId: String(userId),
            },
        });

        newOrder.razorpayOrderId = razorpayOrder.id;
        await newOrder.save();

        res.status(201).json({
            success: true,
            message: 'Razorpay order created.',
            order: newOrder,
            razorpayOrder,
            razorpayKey: process.env.RAZORPAY_KEY_ID,
        });

    } catch (error) {
        const gatewayMessage = error?.error?.description || error?.message || 'Razorpay order creation failed.';
        res.status(500).json({ success: false, message: `Error placing order: ${gatewayMessage}` });

    }
};

const verifyStripePayment = async (req, res) => {
    try {
        const { orderId, sessionId } = req.body;
        const userId = req.body.userId;

        if (!orderId || !sessionId) {
            return res.status(400).json({ success: false, message: 'orderId and sessionId are required.' });
        }

        const existingOrder = await order.findById(orderId);
        if (!existingOrder) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        if (String(existingOrder.userId) !== String(userId)) {
            return res.status(403).json({ success: false, message: 'Not authorized for this order.' });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return res.status(400).json({ success: false, message: 'Payment not completed yet.' });
        }

        if (session.metadata?.orderId !== String(orderId)) {
            return res.status(400).json({ success: false, message: 'Payment verification failed for this order.' });
        }

        existingOrder.payment = true;
        existingOrder.status = 'order placed';
        await existingOrder.save();

        res.json({ success: true, message: 'Stripe payment verified successfully.', order: existingOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Stripe verification failed.', error: error.message });
    }
};

const verifyRazorpayPayment = async (req, res) => {
    try {
        const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.body.userId;

        if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Missing Razorpay verification fields.' });
        }

        const existingOrder = await order.findById(orderId);
        if (!existingOrder) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        if (String(existingOrder.userId) !== String(userId)) {
            return res.status(403).json({ success: false, message: 'Not authorized for this order.' });
        }

        if (existingOrder.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({ success: false, message: 'Razorpay order ID mismatch.' });
        }

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Invalid Razorpay signature.' });
        }

        existingOrder.payment = true;
        existingOrder.status = 'order placed';
        existingOrder.razorpayPaymentId = razorpay_payment_id;
        await existingOrder.save();

        res.json({ success: true, message: 'Razorpay payment verified successfully.', order: existingOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Razorpay verification failed.', error: error.message });
    }
};

//for admin panel to get all orders
const getallorders=async(req,res)=>{
    try {
        const orders = await order.find({}).sort({ date: -1 });

        const uniqueUserIds = [...new Set(orders.map((singleOrder) => String(singleOrder.userId || '')).filter(Boolean))];
        const users = await user.find({ _id: { $in: uniqueUserIds } }).select('_id name email');

        const userMap = users.reduce((acc, currentUser) => {
            acc[String(currentUser._id)] = {
                name: currentUser.name,
                email: currentUser.email,
            };
            return acc;
        }, {});

        const enrichedOrders = orders.map((singleOrder) => {
            const plainOrder = singleOrder.toObject();
            const customer = userMap[String(singleOrder.userId)] || {};

            return {
                ...plainOrder,
                customerName: plainOrder.address?.fullName || customer.name || 'Unknown Customer',
                customerEmail: plainOrder.address?.email || customer.email || 'N/A',
            };
        });

        res.json({ success: true, orders: enrichedOrders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching all orders', error: error.message });
    }
};

// for user to get his orders
const getuserorders=async(req,res)=>{
    try {
        const userId = req.body.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized request.' });
        }

        const orders = await order.find({ userId }).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user orders', error: error.message });
    }
};


// For admin panel to update order status
const updateorderstatus=async(req,res)=>{
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({ success: false, message: 'orderId and status are required.' });
        }

        const updatedOrder = await order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        res.json({ success: true, message: 'Order status updated.', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating order status', error: error.message });
    }
};

module.exports = { placeorderCOD, placeorderstripe, placeorderRazorpay, verifyStripePayment, verifyRazorpayPayment, getallorders, getuserorders, updateorderstatus };