const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');
const authenticate = require('../middlewares/authenticate');

router.get('/', authenticate, artistController.getArtists);
router.get('/:id', authenticate, artistController.getArtistById);
router.post('/add-artist', authenticate,authorize(['Admin','Editor']), artistController.addArtist);
router.put('/:id', authenticate, authorize(['Admin','Editor']), artistController.updateArtist);
router.delete('/:id', authenticate,authorize(['Admin', 'Editor']), artistController.deleteArtist);

module.exports = router;