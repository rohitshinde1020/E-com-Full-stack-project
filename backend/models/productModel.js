const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,    
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:[String],
        required:true
    },
    category:{
        type:String,
        required:true
    },
    subCategory:{
        type:String,
        required:true
    },
    sizes:{
        type:[String],
        required:true
    },
    bestseller:{
        type:Boolean,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

const product = mongoose.models.product || mongoose.model('product',productSchema);

module.exports = product;