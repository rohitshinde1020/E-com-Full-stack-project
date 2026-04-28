const express = require('express');
const userrouter = express.Router();
const verifyCaptcha = require('../middlewares/captchamiddle');

const { registerUser,
    loginUser,
    adminlogin, } = require('../controllers/usercontroller');

userrouter.post('/register', verifyCaptcha, registerUser);
userrouter.post('/login', verifyCaptcha, loginUser);
userrouter.post('/adminlogin', adminlogin);

module.exports = userrouter;