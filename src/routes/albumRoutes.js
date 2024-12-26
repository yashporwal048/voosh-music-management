const express = require('express');
const albumController = require('../controllers/albumController');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

router.get('/', authenticate, albumController.getAllAlbums);
router.get('/:id', authenticate, albumController.getAlbumById);
router.post('/add-album', authenticate, albumController.addAlbum);
router.put('/:id', authenticate, albumController.updateAlbum);
router.delete('/:id', authenticate, albumController.deleteAlbum);

module.exports = router;
