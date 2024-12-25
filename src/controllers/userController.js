const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    const { limit = 5, offset = 0, role } = req.query;
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: 401,
                data: null,
                message: 'Unauthorized Access',
                error: null
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'Admin') {
            return res.status(403).json({
                status: 403,
                data: null,
                message: 'Forbidden Access',
                error: null
            })
        }
        const users = await UserModel.getUsers({ limit, offset, role });
        return res.status(200).json({
            status: 200,
            data: users,
            message: 'Users retrieved successfully.',
            error: null
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Server Error',
            error: null
        })
    }
}

const addUser = async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request: Missing required fields.',
            error: null
        });
    }

    if (role === 'Admin') {
        return res.status(403).json({
            status: 403,
            data: null,
            message: 'Forbidden Access: Role "Admin" is not allowed during user creation.',
            error: null
        });
    }

    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: 401,
                data: null,
                message: 'Unauthorized Access',
                error: null
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'Admin') {
            return res.status(403).json({
                status: 403,
                data: null,
                message: 'Forbidden Access/Operation not allowed.',
                error: null
            });
        }

        const existingUser = await UserModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                status: 409,
                data: null,
                message: 'Email already exists.',
                error: null
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        await UserModel.createUser(email, hashedPassword, role);
        return res.status(201).json({
            status: 201,
            data: null,
            message: 'User created successfully.',
            error: null
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Server Error',
            error: null
        });
    }

}


const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: 401,
                data: null,
                message: 'Unauhtorized Access',
                error: null
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'Admin') {
            return res.status(403).json({
                status: 403,
                data: null,
                message: 'Forbidden Access',
                error: null
            });
        }
        // Delete user from database
        const result = await UserModel.deleteUserById(id);
        if (!result) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'User not found.',
                error: null
            });
        }
        return res.status(200).json({
            status: 200,
            data: null,
            message: 'User deleted successfully.',
            error: null
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Server Error',
            error: null
        });
    }
}

const updateUser = async (req, res) => {
    const { old_password, new_password } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    if (!old_password || !new_password) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request: Missing required fields.',
            error: null
        });
    }

    try {
        if (!token) {
            return res.status(401).json({
                status: 401,
                data: null,
                message: 'Unaothorized Access.',
                error: null
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.getUserByEmail(decoded.email);
        if (!user) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'User not found.',
                error: null
            });
        }

        const verify_password = await bcrypt.compare(old_password, user.password);
        if (!verify_password) {
            return res.status(403).json({
                status: 403,
                data: null,
                message: 'Forbidden Access: Incorrect old password.',
                error: null
            });
        }
        const hashedPassword = bcrypt.hash(new_password, 10);

        await UserModel.updateUser(decoded.email, hashedPassword);
        return res.status(204).json({
            status: 204,
            message: 'Password updated successfully.',
            data: null,
            error: null
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Server Error',
            error: null
        });
    }
}

module.exports = { getAllUsers, addUser, deleteUser, updateUser }