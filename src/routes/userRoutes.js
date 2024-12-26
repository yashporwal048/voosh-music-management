const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

router.get('/', authenticate, authorize('Admin'), userController.getAllUsers);
router.post('/add-user', authenticate, authorize('Admin'), userController.addUser);
router.delete('/:id', authenticate, authorize('Admin'), userController.deleteUser);
router.put('/update-password', authenticate, userController.updateUser);

module.exports = router;
