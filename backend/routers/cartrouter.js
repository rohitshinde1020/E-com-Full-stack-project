const express=require('express');
const cartrouter=express.Router();
const {addtocart,updatecart,getusercart}=require('../controllers/cartcontroller');
const auth=require('../middlewares/usermiddle.js');

cartrouter.post('/add',auth,addtocart);
cartrouter.post('/update',auth,updatecart);
cartrouter.post('/usercart',auth,getusercart);

module.exports=cartrouter;