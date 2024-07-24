const express = require('express');
const router = express.Router();
const {loginUser, registerUser, authMiddleware} = require('../middleware/auth');
const session = require('express-session');
const {httpOnly} = require("express-session/session/cookie");

//[POST] Api for login
router.post('/login', async(req, res) => {
    try {
        const {username, password} = req.body;
        const token = await loginUser(username, password);
        req.session.user = {username}; // Lưu trữ thông tin người dùng trong session
        res.cookie('token', token, {maxAge: 15 * 60 * 1000, httpOnly: true});
        res.header('Authorization', `Bearer ${token}`).send({token});
    } catch (error) {
        res.status(400).send({message: error.message});
    }
});
//[POST] Api for register
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;
    const userId = await registerUser(username, password, email, phone);
    res.status(201).send({ message: 'User registered successfully', userId });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/protected', authMiddleware, (req, res) => {
  if (req.session.user) {
    res.send(`Hello, ${req.session.user.username}. This is a protected route`);
  } else {
    res.status(401).send('Unauthorized');
  }
});

// [POST] Api for logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Failed to logout');
    }
    res.clearCookie('token'); // Xóa cookie chứa token
    res.status(200).send('Logged out successfully');
  });
});


module.exports = router;