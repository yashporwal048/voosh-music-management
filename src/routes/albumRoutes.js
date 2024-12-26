const express = require('express');
const albumController = require('../controllers/albumController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize')
const router = express.Router();

router.get('/', authenticate, albumController.getAllAlbums);
router.get('/:id', authenticate, albumController.getAlbumById);
router.post('/add-album', authenticate, authorize(['Admin','Editor']),albumController.addAlbum);
router.put('/:id', authenticate, authorize(['Admin','Editor']),albumController.updateAlbum);
router.delete('/:id', authenticate,authorize(['Admin','Editor']), albumController.deleteAlbum);

module.exports = router;
