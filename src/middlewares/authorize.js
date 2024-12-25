const authorize = (requiredRole) => {
    return (req, res, next) => {
        if (req.user.role !== requiredRole) {
            return res.status(403).json({
                status: 403,
                data: null,
                message: 'Forbidden Access',
                error: null,
            });
        }
        next();
    };
};

module.exports = authorize;
