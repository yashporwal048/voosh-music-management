const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signupUser = async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: 400,
            message: 'Missing required fields',
            data: null,
            error: null,
        });
    }

    try {
        const existingUser = await UserModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                status: 409,
                message: 'User with provided email already exists',
                data: null,
                error: null,
            });
        }

        const isFirstUser = await UserModel.getUserCount() === 0;

        const userRole = isFirstUser ? 'Admin' : role || 'Viewer';

        const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.createUser(email, hashedPassword, userRole);

        return res.status(201).json({
            status: 201,
            message: 'User created successfully.',
            data: null,
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


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            status: 400, 
            message: 'Email and password are required.', 
            data: null, 
            error: null 
        });
    }

    try {
        const user = await UserModel.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ 
                status: 404, 
                message: 'User not found.', 
                data: null, 
                error: null 
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ 
                status: 401, 
                message: 'Invalid password.', 
                data: null, 
                error: null 
            });
        }

        const token = jwt.sign(
            { user_id: user.user_id, email: user.email, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            status: 200,
            data: { token },
            message: 'Login successful.',
            error: null
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: 500, 
            message: 'Server error.', 
            data: null, 
            error: error.message 
        });
    }
};

const logoutUser = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(400).json({
            status: 400,
            message: 'Bad Request',
            data: null,
            error: null
        });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);

        return res.status(200).json({
            status: 200,
            message: 'User logged out successfully.',
            data: null,
            error: null
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Bad request, Invalid Token.',
            data: null,
            error: error.message
        });
    }
};
module.exports = { signupUser, loginUser, logoutUser };
