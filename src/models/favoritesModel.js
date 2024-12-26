const pool = require('../config/database');

const getFavorites = async ({ userId, category, limit, offset }) => {
    const query = `
        SELECT 
            favorite_id,
            category,
            item_id,
            CASE 
                WHEN category = 'artist' THEN (SELECT name FROM artists WHERE artist_id = item_id)
                WHEN category = 'album' THEN (SELECT name FROM albums WHERE album_id = item_id)
                WHEN category = 'track' THEN (SELECT name FROM tracks WHERE track_id = item_id)
            END AS name,
            created_at
        FROM favorites
        WHERE user_id = $1 AND category = $2
        LIMIT $3 OFFSET $4;
    `;
    const { rows } = await pool.query(query, [userId, category, limit, offset]);
    return rows;
};

// Check if an item exists
const checkItemExists = async (category, itemId) => {
    const table = category === 'artist' ? 'artists' : category === 'album' ? 'albums' : 'tracks';
    const query = `SELECT 1 FROM ${table} WHERE ${table.slice(0, -1)}_id = $1;`;
    console.log(itemId);
    const { rows } = await pool.query(query, [itemId]);
    return rows.length > 0;
};

// Add a new favorite
const addFavorite = async ({ userId, category, item_id }) => {
    const query = `
        INSERT INTO favorites (user_id, category, item_id)
        VALUES ($1, $2, $3);
    `;
    await pool.query(query, [userId, category, item_id]);
};

// Get a favorite by ID
const getFavoriteById = async (id) => {
    const query = `
        SELECT * FROM favorites WHERE favorite_id = $1;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

// Remove a favorite
const removeFavorite = async (id) => {
    const query = `
        DELETE FROM favorites WHERE favorite_id = $1;
    `;
    await pool.query(query, [id]);
};

module.exports = {
    getFavorites,
    checkItemExists,
    addFavorite,
    getFavoriteById,
    removeFavorite,
};
