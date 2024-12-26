const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: 'Bad request: missing auth token.',
            error: null,
        });
    }

    const token = authHeader.split(' ')[1]; 

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next(); 
    } catch (error) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: 'Unauthorized access',
            error: error.message,
        });
    }
};

module.exports = authenticate;
