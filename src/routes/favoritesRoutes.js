import express from 'express';
import favoritesController from '../controllers/favoritesController.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.get('/:category', authenticate, favoritesController.getFavorites);

router.post('/add-favorite', authenticate, favoritesController.addFavorite);

router.delete('/remove-favorite/:id', authenticate, favoritesController.removeFavorite);

export default router;
