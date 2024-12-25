// models/userModel.js
const { Pool } = require('pg');
const pool = require('../database');

const createUser = async (email, password, role) => {
  const query = `
    INSERT INTO users (email, password, role) 
    VALUES ($1, $2, $3) 
    RETURNING user_id, email, role, created_at;
  `;
  const values = [email, password, role];
  
  try {
    const result = await pool.query(query, values);
    return result.rows[0]; // return the newly created user
  } catch (error) {
    throw error; // throw error to be handled by controller
  }
};

const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  try {
    const result = await pool.query(query, [email]);
    return result.rows[0]; // return the user if found
  } catch (error) {
    throw error; // throw error to be handled by controller
  }
};

module.exports = { createUser, getUserByEmail };
