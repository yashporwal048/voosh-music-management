const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: { rejectUnauthorized: false }
});

pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database.');
});

pool.on('error', (err, client) => {
    console.error('Error on idle client', err);
});

module.exports = pool;