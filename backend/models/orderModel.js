const express = require('express');
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId : { type: String,  required: true },
    items: {type: Array , required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: 'order placed', required: true },
    paymentmethod : {type:String , required:true },
    payment :{type :Boolean,required:true,default:false},
    date : {type:Number,required:true},
    stripeSessionId: { type: String, default: '' },
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' }
});

const order = mongoose.model('order', orderSchema);
module.exports = order;