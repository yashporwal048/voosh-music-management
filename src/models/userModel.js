const pool = require('../config/database');

// Function to create a new user
const createUser = async (email, password, role) => {
    const query = `
        INSERT INTO users (email, password, role) 
        VALUES ($1, $2, $3) 
        RETURNING user_id, email, role, created_at;
    `;
    const values = [email, password, role];
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
};

// Function to get a user by email
const getUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    try {
        const result = await pool.query(query, [email]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Error fetching user by email: ' + error.message);
    }
};

// Function to get the total number of users
const getUserCount = async () => {
    const query = 'SELECT COUNT(*) AS count FROM users';
    try {
        const result = await pool.query(query);
        return parseInt(result.rows[0].count, 10);
    } catch (error) {
        throw new Error('Error fetching user count: ' + error.message);
    }
};

module.exports = { createUser, getUserByEmail, getUserCount };
