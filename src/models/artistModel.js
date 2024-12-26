const pool = require('../config/database');
const getArtists = async ({ limit, offset, filters }) => {
    const conditions = [];
    const values = [];

    if (filters.grammy) {
        conditions.push('grammy = $' + (conditions.length + 1));
        values.push(filters.grammy);
    }
    if (filters.hidden !== undefined) {
        conditions.push('hidden = $' + (conditions.length + 1));
        values.push(filters.hidden === 'true');
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `
        SELECT artist_id, name, grammy, hidden 
        FROM artists 
        ${whereClause} 
        LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;
    values.push(limit, offset);

    const { rows } = await pool.query(query, values);
    return rows;
};


const getArtistById = async (id) => {
    const query = `SELECT artist_id, name, grammy, hidden FROM artists WHERE artist_id = $1;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

const addArtist = async ({ name, grammy, hidden }) => {
    const query = `
        INSERT INTO artists (name, grammy, hidden) 
        VALUES ($1, $2, $3) RETURNING artist_id;
    `;
    const { rows } = await pool.query(query, [name, grammy, hidden]);
    return rows[0];
};

const updateArtist = async (id, updates) => {
    const fields = [];
    const values = [];

    Object.keys(updates).forEach((key, index) => {
        fields.push(`${key} = $${index + 1}`);
        values.push(updates[key]);
    });

    values.push(id);
    const query = `
        UPDATE artists 
        SET ${fields.join(', ')} 
        WHERE artist_id = $${values.length} RETURNING artist_id;
    `;
    const { rowCount } = await pool.query(query, values);
    return rowCount > 0;
};

const deleteArtist = async (id) => {
    const query = `DELETE FROM artists WHERE artist_id = $1 RETURNING *;`;
    const { rews } = await pool.query(query, [id]);
    return rows[0];
};

module.exports = { getArtists, getArtistById, addArtist, updateArtist, deleteArtist }