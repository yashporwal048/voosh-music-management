import express from 'express';
import userController from '../controllers/userController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const router = express.Router();

router.get('/', authenticate, authorize(['Admin']), userController.getAllUsers);
router.post('/add-user', authenticate, authorize(['Admin']), userController.addUser);
router.delete('/:id', authenticate, authorize(['Admin']), userController.deleteUser);
router.put('/update-password', authenticate, authorize(['Admin']), userController.updateUser);

export default router;
