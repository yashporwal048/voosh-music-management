import express from 'express';
import albumController from '../controllers/albumController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const router = express.Router();

router.get('/', authenticate, albumController.getAllAlbums);
router.get('/:id', authenticate, albumController.getAlbumById);
router.get('/:id', authenticate, albumController.getAlbumDuration);
router.post('/add-album', authenticate, authorize(['Admin', 'Editor']), albumController.addAlbum);
router.put('/:id', authenticate, authorize(['Admin', 'Editor']), albumController.updateAlbum);
router.delete('/:id', authenticate, authorize(['Admin', 'Editor']), albumController.deleteAlbum);

export default router;
