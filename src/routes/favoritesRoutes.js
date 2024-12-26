const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const authenticate = require('../middlewares/authenticate');

router.get('/:category', authenticate, favoritesController.getFavorites);

router.post('/add-favorite', authenticate, favoritesController.addFavorite);

router.delete('/remove-favorite/:id', authenticate, favoritesController.removeFavorite);

module.exports = router;
