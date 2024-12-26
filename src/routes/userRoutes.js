const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

router.get('/', userController.getAllUsers);
router.post('/add', authenticate, authorize('Admin'), userController.addUser);
router.delete('/:id', userController.deleteUser);
router.put('/update-password', authenticate, userController.updateUser);

module.exports = router;
