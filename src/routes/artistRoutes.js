import express from 'express';
import artistController from '../controllers/artistController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const router = express.Router();

router.get('/', authenticate, artistController.getArtists);
router.get('/:id', authenticate, artistController.getArtistById);
router.post('/add-artist', authenticate, authorize(['Admin', 'Editor']), artistController.addArtist);
router.put('/:id', authenticate, authorize(['Admin', 'Editor']), artistController.updateArtist);
router.delete('/:id', authenticate, authorize(['Admin', 'Editor']), artistController.deleteArtist);

export default router;