const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/', userController.getAllUsers);
router.post('add-user', userController.addUser);
router.delete('/:id',userController.deleteUser);
router.put('/update-password', userController.updateUser);

module.exports = router;