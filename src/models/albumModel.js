const pool = require('../config/database');

const getAllAlbums = async ({ limit, offset, artist_id, hidden }) => {
    const conditions = [];
    const values = [];
    if (artist_id) {
        conditions.push('a.artist_id = $' + (values.length + 1));
        values.push(artist_id);
    }
    if (hidden !== undefined) {
        conditions.push('a.hidden = $' + (values.length + 1));
        values.push(hidden);
    }
    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const query = `
        SELECT 
            a.album_id, 
            a.name AS name, 
            a.year, 
            a.hidden, 
            ar.name AS artist_name
        FROM albums a
        JOIN artists ar ON a.artist_id = ar.artist_id
        ${whereClause}
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2};
    `;
    values.push(limit, offset);
    const { rows } = await pool.query(query, values);
    return rows;
};


const getAlbumById = async (id) => {
    const query = `
        SELECT 
            a.album_id, 
            a.name AS name, 
            a.year, 
            a.hidden, 
            ar.name AS artist_name
        FROM albums a
        JOIN artists ar ON a.artist_id = ar.artist_id
        WHERE a.album_id = $1;
    `;
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

const updateAlbum = async (id, update) => {
    const updates = [];
    const values = [];
    const { name, year, hidden } = update;
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

const checkArtistExists = async (artist_id) => {
    const query = `SELECT 1 FROM artists WHERE artist_id = $1 LIMIT 1;`;
    const result = await pool.query(query, [artist_id]);
    return result.rowCount > 0;
};

module.exports = {
    getAllAlbums,
    getAlbumById,
    addAlbum,
    updateAlbum,
    deleteAlbum,
    checkArtistExists
};
