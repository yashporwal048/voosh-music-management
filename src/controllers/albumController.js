const AlbumModel = require('../models/albumModel');

const getAllAlbums = async (req, res) => {
    const { limit = 5, offset = 0, artist_id, hidden } = req.query;

    if (isNaN(limit) || isNaN(offset)) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request: limit and offset must be numeric.',
            error: null,
        });
    }

    if (hidden !== undefined && hidden !== 'true' && hidden !== 'false') {
        return res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request: hidden must be either true or false.',
            error: null,
        });
    }

    try {
        if (artist_id) {
            const artistExists = await AlbumModel.checkArtistExists(artist_id); // Implement this in the model
            if (!artistExists) {
                return res.status(404).json({
                    status: 404,
                    data: null,
                    message: 'Artist not found. Invalid artist_id.',
                    error: null,
                });
            }
        }

        // Fetch albums from the database
        const albums = await AlbumModel.getAllAlbums({
            limit: Number(limit),
            offset: Number(offset),
            artist_id,
            hidden: hidden === 'true',
        });

        if (!albums || albums.length === 0) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'No albums found.',
                error: null,
            });
        }

        return res.status(200).json({
            status: 200,
            data: albums,
            message: 'Albums retrieved successfully.',
            error: null,
        });
    } catch (error) {
        console.error('Error fetching albums:', error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Server Error',
            error: null,
        });
    }
};

const getAlbumById = async (req, res) => {
    const { id } = req.params;

    try {
        const album = await AlbumModel.getAlbumById(id);
        if (!album) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Album not found.',
                error: null,
            });
        }

        return res.status(200).json({
            status: 200,
            data: album,
            message: 'Album retrieved successfully.',
            error: null,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Server Error',
            error: null,
        });
    }
};

const addAlbum = async (req, res) => {
    const { artist_id, name, year, hidden } = req.body;

    if (!artist_id || !name || !year) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request: Missing required fields.',
            error: null,
        });
    }

    try {
        const newAlbum = await AlbumModel.addAlbum({ artist_id, name, year, hidden });
        return res.status(201).json({
            status: 201,
            data: null,
            message: 'Album created successfully.',
            error: null,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Server Error',
            error: null,
        });
    }
};

const updateAlbum = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    Object.keys(updates).forEach((key) => {
        if (!['name', 'year', 'hidden'].includes(key)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad request: invalid fields passed!',
                error: null,
            });
        }
    });
    try {
        const updated = await AlbumModel.updateAlbum(id, { name, year, hidden });
        if (!updated) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Album not found.',
                error: null,
            });
        }

        return res.status(204).json({
            status: 204,
            data: null,
            message: 'Album updated successfully.',
            error: null,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Server Error',
            error: null,
        });
    }
};

const deleteAlbum = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAlbum = await AlbumModel.deleteAlbum(id);
        if (!deletedAlbum) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Album not found.',
                error: null,
            });
        }

        return res.status(200).json({
            status: 200,
            data: null,
            message: `Album: ${deletedAlbum.name} deleted successfully.`,
            error: null,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Server Error',
            error: null,
        });
    }
};

module.exports = {
    getAllAlbums,
    getAlbumById,
    addAlbum,
    updateAlbum,
    deleteAlbum,
};
