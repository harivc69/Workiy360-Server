module.exports = {
    verifyToken: (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(403).json({ message: 'No token provided!' });
        }
        // Logic to verify the token goes here
        // If valid, call next(), otherwise return an error response
    },

    checkUserRole: (roles) => {
        return (req, res, next) => {
            const userRole = req.user.role; // Assuming user role is set in req.user
            if (!roles.includes(userRole)) {
                return res.status(403).json({ message: 'Access denied!' });
            }
            next();
        };
    }
};