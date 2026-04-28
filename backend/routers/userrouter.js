const express = require('express');
const userrouter = express.Router();

const { registerUser,
    loginUser,
    adminlogin, } = require('../controllers/usercontroller');

userrouter.post('/register', registerUser);
userrouter.post('/login', loginUser);
userrouter.post('/adminlogin', adminlogin);

module.exports = userrouter;