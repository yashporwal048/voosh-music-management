const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.get('/', authenticate, authorize('Admin'), userController.getAllUsers);
router.post('/add', authenticate, authorize('Admin'), userController.addUser);
router.delete('/:id', authenticate, authorize('Admin'), userController.deleteUser);
router.put('/update', authenticate, userController.updateUser);

module.exports = router;
