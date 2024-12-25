const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/signup', userController.signupUser);
// router.post('/login', authController.loginUser);
// router.get('/logout', authController.logoutUser);

module.exports = router;