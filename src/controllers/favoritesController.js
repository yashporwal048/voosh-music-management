const FavoritesModel = require('../models/favoritesModel');

const getFavorites = async (req, res) => {
    const { category } = req.params;
    const { limit = 5, offset = 0 } = req.query;
    const userId = req.user.id;

    try {
        if (!['artist', 'album', 'track'].includes(category)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Invalid category.',
                error: null,
            });
        }

        const favorites = await FavoritesModel.getFavorites({ userId, category, limit, offset });

        if (favorites.length === 0) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'No favorites found.',
                error: null,
            });
        }

        return res.status(200).json({
            status: 200,
            data: favorites,
            message: 'Favorites retrieved successfully.',
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

const addFavorite = async (req, res) => {
    const { category, item_id } = req.body;
    const userId = req.user.id;

    try {
        if (!['artist', 'album', 'track'].includes(category)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Invalid category.',
                error: null,
            });
        }

        const itemExists = await FavoritesModel.checkItemExists(category, item_id);
        if (!itemExists) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: `${category} with the given ID does not exist.`,
                error: null,
            });
        }

        await FavoritesModel.addFavorite({ userId, category, item_id });

        return res.status(201).json({
            status: 201,
            data: null,
            message: 'Favorite added successfully.',
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


const removeFavorite = async (req, res) => {
    const { id } = req.params;

    try {
        const favorite = await FavoritesModel.getFavoriteById(id);

        if (!favorite) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Favorite not found.',
                error: null,
            });
        }

        await FavoritesModel.removeFavorite(id);

        return res.status(200).json({
            status: 200,
            data: null,
            message: `Favorite removed successfully.`,
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
    getFavorites,
    addFavorite,
    removeFavorite,
};
