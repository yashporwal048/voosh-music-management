const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction
        ? { rejectUnauthorized: false } // Use SSL in production
        : false,
});

pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database.');
});

pool.on('error', (err, client) => {
    console.error('Error on idle client', err);
    process.exit(-1); // Exit process in case of error
});

module.exports = pool;