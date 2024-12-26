const pool = require('../config/database');

const getAllTracks = async ({ limit, offset, artist_id, album_id, hidden }) => {
    const conditions = [];
    const values = [];
    if (artist_id) {
        conditions.push('t.artist_id = $' + (values.length + 1));
        values.push(artist_id);
    }
    if (album_id) {
        conditions.push('t.album_id = $' + (values.length + 1));
        values.push(album_id);
    }
    if (hidden !== undefined) {
        conditions.push('t.hidden = $' + (values.length + 1));
        values.push(hidden);
    }
    const whereClause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const query = `
        SELECT 
            t.track_id, 
            t.name, 
            t.duration, 
            t.hidden, 
            a.name AS artist_name, 
            al.name AS album_name
        FROM tracks t
        JOIN artists a ON t.artist_id = a.artist_id
        JOIN albums al ON t.album_id = al.album_id
        ${whereClause}
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2};
    `;
    values.push(limit, offset);
    const { rows } = await pool.query(query, values);
    return rows;
};

const getTrackById = async (id) => {
    const query = `
        SELECT 
            t.track_id, 
            t.name, 
            t.duration, 
            t.hidden, 
            a.name AS artist_name, 
            al.name AS album_name
        FROM tracks t
        JOIN artists a ON t.artist_id = a.artist_id
        JOIN albums al ON t.album_id = al.album_id
        WHERE t.track_id = $1;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

const addTrack = async ({ artist_id, album_id, name, duration, hidden }) => {
    const query = `
        INSERT INTO tracks (artist_id, album_id, name, duration, hidden)
        VALUES ($1, $2, $3, $4, $5);
    `;
    await pool.query(query, [artist_id, album_id, name, duration, hidden]);
};

const updateTrack = async (id, updates) => {
    const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`);
    const values = [id, ...Object.values(updates)];
    const query = `
        UPDATE tracks
        SET ${fields.join(', ')}
        WHERE track_id = $1;
    `;
    const result = await pool.query(query, values);
    return result.rowCount > 0;
};

const deleteTrack = async (id) => {
    const query = `DELETE FROM tracks WHERE track_id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
};

module.exports = {
    getAllTracks,
    getTrackById,
    addTrack,
    updateTrack,
    deleteTrack,
};
