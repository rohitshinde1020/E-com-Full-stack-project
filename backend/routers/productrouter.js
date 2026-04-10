const express = require('express');
const productrouter = express.Router();
const upload = require('../middlewares/multer.js');
const adminauth = require('../middlewares/authmiddle.js');   

const  {addproduct,
    listproducts,
    removeproduct,
    singleproduct} = require('../controllers/productcontroller');


productrouter.post('/add', adminauth, upload.fields([{name: 'image1' , maxCount: 1},{name:'image2', maxCount: 1},{name:'image3', maxCount: 1},{name:'image4', maxCount: 1}]), addproduct);
productrouter.get('/list', listproducts);
productrouter.post('/remove', adminauth,     removeproduct);
productrouter.post('/single', adminauth, singleproduct);


module.exports = productrouter;