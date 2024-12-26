const TrackModel = require('../models/trackModel');

const getAllTracks = async (req, res) => {
    const { limit = 5, offset = 0, artist_id, album_id, hidden } = req.query;
    if (isNaN(limit) || isNaN(offset)) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request: limit and offset must be numeric.',
            error: null,
        });
    }
    try {
        const tracks = await TrackModel.getAllTracks({ limit, offset, artist_id, album_id, hidden });
        if (!tracks || tracks.length === 0) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'No tracks found.',
                error: null,
            });
        }

        return res.status(200).json({
            status: 200,
            data: tracks,
            message: 'Tracks retrieved successfully.',
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
};
