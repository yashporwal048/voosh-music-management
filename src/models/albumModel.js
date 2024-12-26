const pool = require('../config/database');

const getAllAlbums = async ({ limit, offset, artist_id, hidden }) => {
    const conditions = [];
    const values = [];
    if (artist_id) {
        conditions.push('artist_id = $' + (values.length + 1));
        values.push(artist_id);
    }
    if (hidden !== undefined) {
        conditions.push('hidden = $' + (values.length + 1));
        values.push(hidden);
    }
    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const query = `
        SELECT * FROM albums 
        ${whereClause} 
        LIMIT $${values.length + 1} 
        OFFSET $${values.length + 2};
    `;
    values.push(limit, offset);
    const { rows } = await pool.query(query, values);
    return rows;
};

const getAlbumById = async (id) => {
    const query = `SELECT * FROM albums WHERE album_id = $1;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

const addAlbum = async ({ artist_id, name, year, hidden }) => {
    const query = `
        INSERT INTO albums (artist_id, name, year, hidden) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [artist_id, name, year, hidden]);
    return rows[0];
};

const updateAlbum = async (id, { name, year, hidden }) => {
    const updates = [];
    const values = [];
    if (name) {
        updates.push('name = $' + (values.length + 1));
        values.push(name);
    }
    if (year) {
        updates.push('year = $' + (values.length + 1));
        values.push(year);
    }
    if (hidden !== undefined) {
        updates.push('hidden = $' + (values.length + 1));
        values.push(hidden);
    }
    values.push(id);
    const query = `
        UPDATE albums 
        SET ${updates.join(', ')} 
        WHERE album_id = $${values.length} 
        RETURNING *;
    `;
    const result = await pool.query(query, values);
    return result.rowCount > 0;
};

const deleteAlbum = async (id) => {
    const query = `DELETE FROM albums WHERE album_id = $1 RETURNING *;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

module.exports = {
    getAllAlbums,
    getAlbumById,
    addAlbum,
    updateAlbum,
    deleteAlbum,
};
