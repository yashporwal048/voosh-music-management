const artistModel = require('../models/artistModel');

const getArtists = async (req, res) => {
    try {
        const { limit = 5, offset = 0, grammy, hidden } = req.query;
        const filters = { grammy, hidden };
        const artists = await artistModel.getArtists({ limit, offset, filters });
        res.status(200).json({
            status: 200,
            data: artists,
            message: 'Artists retrieved successfully',
            error: null
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'Server Error.',
            error: error.message,
        })
    }
}

const getArtistById = async (req, res) => {
    try {
        const { id } = req.params;
        const artists = await artistModel.getArtistById(id);
        if (!artists) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Artist not found.',
                error: null,
            });
        }

        res.status(200).json({
            status: 200,
            data: artist,
            message: 'Artist fetched successfully.',
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'Server error',
            error: null,
        });
    }
}

const addArtist = async (req, res) => {
    try {
        const { name, grammy, hidden } = req.body;
        if (!name || grammy === undefined || hidden === undefined) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request: Missing required fields.',
                error: null,
            });
        }
        await artistModel.addArtist({ name, grammy, hidden });
        res.status(201).json({
            status: 201,
            data: null,
            message: 'Artist created successfully.',
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'Server error',
            error: null,
        });
    }
}

const updateArtist = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updated = await artistModel.updateArtist(id, updates);

        if (!updated) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Artist not found.',
                error: null,
            });
        }

        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'Server error',
            error: null,
        });
    }
};

const deleteArtist = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedArtist = await artistModel.deleteArtist(id);

        if (!deletedArtist) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Artist not found.',
                error: null,
            });
        }

        res.status(200).json({
            status: 200,
            data: { artist_id: id },
            message: `Artist: ${deletedArtist.name} deleted successfully.`,
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: null,
            message: 'Server error',
            error: null,
        });
    }
};

module.exports = { getArtists, getArtistById, addArtist, updateArtist, deleteArtist }