const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signupUser = async (req, res) => {
    const { email, password, role } = req.body;
    if (!['Admin', 'Editor', 'Viewer'].includes(role)) {
        return res.status(400).json({ status: 400, message: 'Invalid Role', data: null, error: null });
    }
    //validating required fields
    if (!email || !password || !role) {
        return res.status(400).json({ status: 400, message: 'Missing required fields', data: null, error: null });
    }
    try {
        //check if user exists
        const existingUser = await UserModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ status: 409, message: 'User with provided email already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = UserModel.createUser(email, hashedPassword, role);

        const token = jwt.sign({ user_id: newUser.user_id, email: newUser.email, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' })

        return res.status(201).json({
            status: 201,
            data: null,
            message: 'User created successfully.',
            error: null
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            message: "Server Error"
        })
    }
}

module.exports = { signupUser }