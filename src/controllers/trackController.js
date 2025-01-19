const TrackModel = require('../models/trackModel');
const artistModel = require('../models/artistModel');
const albumModel = require('../models/albumModel');
const multer = require('multer');
const path = require('path');
const redisClient = require('../config/redis');
// const getAsync = promisify(client.get).bind(client);
const { promisify } = require('util');
const setAsync = promisify(redisClient.setEx).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient)


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); //save file to uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file names
    },
})

const upload = multer({ storage: storage });

const importTracks = (req, res) => {
    const { file } = req;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded!' });
    }

    TrackModel.importTracksFromCSV(file.path)
        .then((message) => {
            res.status(200).json({ message })
        }).catch((error) => {
            res.status(500).json({ error: 'Failed to import tracks', message: error.message }); x
        })
}


const getTrackLogs = async (req, res) => {
    const { limit = 5, offset = 0 } = req.query;
    const cacheKey = `trackLogs:${limit}:${offset}`;

    if (isNaN(limit) || isNaN(offset)) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request: limit and offset must be numeric.',
            error: null,
        });
    }
    try {
        redisClient.get(cacheKey, async (cachedData) => {
            if (cachedData) {
                return res.status(200).json({
                    status: 200,
                    data: JSON.parse(cachedData),
                    message: 'Data retrieved from cache',
                    error: null
                })
            } else {
                const trackLogs = await TrackModel.getTrackLogs({ limit, offset })
                if (!tracksLogs || tracksLogs.length === 0) {
                    return res.status(404).json({
                        status: 404,
                        data: null,
                        message: 'No tracks found.',
                        error: null,
                    });
                }
                await setAsync(cacheKey, 60, JSON.stringify(trackLogs));

                return res.status(200).json({
                    status: 200,
                    data: trackLogs,
                    message: 'Tracks Logs retrieved successfully.',
                    error: null,
                });
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Server Error',
            error: error.message,
        });
    }
}

const getAllTracks = async (req, res) => {
    const { limit = 5, offset = 0, artist_id, album_id, hidden } = req.query;
    const cacheKey = `tracks:${limit}:${offset}:${artist_id || ''}:${album_id || ''}:${hidden || ''}`;

    if (isNaN(limit) || isNaN(offset)) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request: limit and offset must be numeric.',
            error: null,
        });
    }
    try {
        redisClient.get(cacheKey, async (err, cachedData) => {
            if (cachedData) {
                return res.status(200).json({
                    status: 200,
                    data: JSON.parse(cachedData),
                    message: 'Data retrieved from cache',
                    error: null
                })
            } else {
                const tracks = await TrackModel.getAllTracks({ limit, offset, artist_id, album_id, hidden });
                if (!tracks || tracks.length === 0) {
                    return res.status(404).json({
                        status: 404,
                        data: null,
                        message: 'No tracks found.',
                        error: null,
                    });
                }
                await setAsync(cacheKey, 60, JSON.stringify(tracks));

                return res.status(200).json({
                    status: 200,
                    data: tracks,
                    message: 'Tracks retrieved successfully.',
                    error: null,
                });
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Server Error',
            error: error.message,
        });
    }
};

const getTrackById = async (req, res) => {
    const { id } = req.params;

    try {
        const track = await TrackModel.getTrackById(id);
        if (!track) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Track not found.',
                error: null,
            });
        }

        return res.status(200).json({
            status: 200,
            data: track,
            message: 'Track retrieved successfully.',
            error: null,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Server Error',
            error: error.message,
        });
    }
};

const addTrack = async (req, res) => {
    const { artist_id, album_id, name, duration, hidden } = req.body;

    try {
        // Validate that the artist exists
        const artistExists = await artistModel.checkArtistExists(artist_id);
        if (!artistExists) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Artist not found.',
                error: null,
            });
        }

        // Validate that the album exists
        const albumExists = await albumModel.checkAlbumExists(album_id);
        if (!albumExists) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Album not found.',
                error: null,
            });
        }

        await TrackModel.addTrack({ artist_id, album_id, name, duration, hidden });

        return res.status(201).json({
            status: 201,
            data: null,
            message: 'Track created successfully.',
            error: null,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Server Error',
            error: error.message,
        });
    }
};


const updateTrack = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    Object.keys(updates).forEach((key) => {
        if (!['name', 'duration', 'hidden'].includes(key)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad request: invalid fields passed!',
                error: null,
            });
        }
    });

    try {
        const updated = await TrackModel.updateTrack(id, updates);
        if (!updated) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Track not found.',
                error: null,
            });
        }
        const cacheKey = `tracks:*`
        await delAsync(cacheKey);

        return res.status(204).json({
            status: 204,
            data: null,
            message: 'Track updated successfully.',
            error: null,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Server Error',
            error: error.message,
        });
    }
};


const deleteTrack = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await TrackModel.deleteTrack(id);
        if (!deleted) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Track not found.',
                error: null,
            });
        }

        return res.status(200).json({
            status: 200,
            data: null,
            message: `Track deleted successfully.`,
            error: null,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Server Error',
            error: error.message,
        });
    }
};

module.exports = {
    getAllTracks,
    getTrackById,
    addTrack,
    updateTrack,
    deleteTrack,
    importTracks,
    upload,
    getTrackLogs
};
