const express = require('express');
const { placeorderCOD, placeorderstripe, placeorderRazorpay, verifyStripePayment, verifyRazorpayPayment, getallorders, getuserorders, updateorderstatus } = require('../controllers/ordercontroller.js');
const auth = require('../middlewares/usermiddle.js');
const adminauth = require('../middlewares/authmiddle.js');
const orderrouter = express.Router();


// user routes for placing orders
orderrouter.post('/placecod', auth, placeorderCOD);
orderrouter.post('/placestripe', auth, placeorderstripe);
orderrouter.post('/placerazorpay', auth, placeorderRazorpay);
orderrouter.post('/verifystripe', auth, verifyStripePayment);
orderrouter.post('/verifyrazorpay', auth, verifyRazorpayPayment);
orderrouter.post('/userorders', auth, getuserorders);

// admin routes for managing orders
orderrouter.post('/allorders', adminauth, getallorders);
orderrouter.post('/status', adminauth, updateorderstatus);

module.exports = orderrouter;