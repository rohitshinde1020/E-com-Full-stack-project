const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./config/db.js');
const connectcloudinary = require('./config/cloudinary.js');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const userrouter = require('./routers/userrouter.js');
const productrouter = require('./routers/productrouter.js');
const cartrouter = require('./routers/cartrouter.js');
const orderrouter = require('./routers/orderrouter.js');

app.use(cors());
app.use(express.json());
app.use(cookieParser());

connectDB();
connectcloudinary();

app.use('/api/users', userrouter);
app.use('/api/products', productrouter);
app.use('/api/cart', cartrouter);
app.use('/api/orders', orderrouter);

const PORT = process.env.PORT || 3000;

app.get('/',(req,res)=>{
    res.json('hello u hit home route api')
})

app.listen(PORT , ()=>{
    console.log("app is listening at " ,PORT)
})

