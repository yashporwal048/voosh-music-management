const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    const { limit = 5, offset = 0, role } = req.query;
    try {
        const users = await UserModel.getUsers({ limit, offset, role });
        return res.status(200).json({
            status: 200,
            data: users,
            message: 'Users fetched successfully.',
            error: null,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Server Error',
            error: null,
        });
    }
};

const addUser = async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request: Missing required fields.',
            error: null,
        });
    }

    if (role === 'Admin') {
        return res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad request: Role "Admin" is not allowed during user creation.',
            error: null,
        });
    }

    try {
        const existingUser = await UserModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                status: 409,
                data: null,
                message: 'Email already exists.',
                error: null,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.createUser(email, hashedPassword, role);
        return res.status(201).json({
            status: 201,
            data: null,
            message: 'User created successfully.',
            error: null,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Server Error',
            error: null,
        });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await UserModel.deleteUserById(id);
        if (!result) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'User not found.',
                error: null,
            });
        }
        return res.status(200).json({
            status: 200,
            data: null,
            message: 'User deleted successfully.',
            error: null,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Server Error',
            error: null,
        });
    }
};

const updateUser = async (req, res) => {
    const { old_password, new_password } = req.body;
    if (!old_password || !new_password) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request: Missing required fields.',
            error: null,
        });
    }

    try {
        const user = await UserModel.getUserByEmail(req.user.email);
        if (!user) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'User not found.',
                error: null,
            });
        }

        const isPasswordValid = await bcrypt.compare(old_password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({
                status: 403,
                data: null,
                message: 'Forbidden Access: Incorrect old password.',
                error: null,
            });
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);
        await UserModel.updateUser(req.user.email, hashedPassword);
        return res.status(204).json({
            status: 204,
            message: 'Password updated successfully.',
            data: null,
            error: null,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Server Error',
            error: null,
        });
    }
};

module.exports = { getAllUsers, addUser, deleteUser, updateUser };
