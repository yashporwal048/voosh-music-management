const authorize = (requiredRole) => {
    return (req, res, next) => {
        if ( !requiredRole.includes(req.user.role)) {
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
