const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signupUser = async (req, res) => {
    const { email, password, role } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({
            status: 400,
            message: 'Missing required fields',
            data: null,
            error: null,
        });
    }

    try {
        // Check if the user already exists
        const existingUser = await UserModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                status: 409,
                message: 'User with provided email already exists',
                data: null,
                error: null,
            });
        }

        // Check if this is the first user
        const isFirstUser = await UserModel.getUserCount() === 0;

        // Default role for first user is 'Admin'
        const userRole = isFirstUser ? 'Admin' : role || 'Viewer';

        // Hash password and create the new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.createUser(email, hashedPassword, userRole);

        // Generate a JWT token
        const token = jwt.sign(
            { user_id: newUser.user_id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Respond with success
        return res.status(201).json({
            status: 201,
            message: 'User created successfully.',
            data: { token },
            error: null,
        });
    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({
            status: 500,
            message: 'Server Error',
            data: null,
            error: error.message,
        });
    }
};

module.exports = { signupUser };
