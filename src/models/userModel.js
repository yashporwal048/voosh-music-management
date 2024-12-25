const pool = require('../config/database');
const { deleteUser } = require('../controllers/userController');

// Function to create a new user
const createUser = async (email, password, role) => {
    const query = `
        INSERT INTO users (email, password, role) 
        VALUES ($1, $2, $3) 
        RETURNING user_id, email, role;
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

const getUsers = async({limit, offset, role}) => {
    let query = "Select * from users LIMIT $1 OFFSET $2";
    const values = [limit, offset];
    if(role){
        query += 'Where role = $3';
        values.push(role);
    }

    try {
        const result = await pool.query(query, values);
        return result.rows;
    } catch(error){
        throw error
    }
}

const deleteUserById = async(id) => {
    const query = 'DELETE FROM users WHERE user_id = $1';
    try {
        const result = await pool.query(query, [id]);
        return result.rowCount > 0;
    } catch(error){
        throw error;
    }
}

const updateUser = async(email, newPassword) => {
    const query = 'Update users SET password = $1 where email = $2 RETURNING *';
    try{
        const result = await pool.query(query, [newPassword, email]);
        return result.rows[0];
    } catch(error){
        throw error;
    }
}
module.exports = { createUser, getUserByEmail, getUserCount, getUsers, deleteUserById, updateUser };
