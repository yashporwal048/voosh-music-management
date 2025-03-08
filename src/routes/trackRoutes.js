import express from 'express';
import trackController from '../controllers/trackController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const router = express.Router();

router.get('/', trackController.getAllTracks);
router.get('/logs', authenticate, trackController.getTrackLogs);
router.get('/:id', trackController.getTrackById);
router.post('/add-track', authenticate, authorize(['Admin', 'Editor']), trackController.addTrack);
router.put('/:id', authenticate, authorize(['Admin', 'Editor']), trackController.updateTrack);
router.delete('/:id', authenticate, authorize(['Admin', 'Editor']), trackController.deleteTrack);
router.post('/import-tracks', authenticate, authorize(['Admin', 'Editor']), trackController.upload.single('csvFile'), trackController.importTracks);

export default router;
