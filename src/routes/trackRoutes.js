const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

router.get('/', trackController.getAllTracks);
router.get('/:id', trackController.getTrackById);
router.post('/add-track', authenticate,authorize(['Admin','Editor']),trackController.addTrack);
router.put('/:id',authenticate,authorize(['Admin','Editor']), trackController.updateTrack);
router.delete('/:id',authenticate,authorize(['Admin','Editor']), trackController.deleteTrack);

module.exports = router;
