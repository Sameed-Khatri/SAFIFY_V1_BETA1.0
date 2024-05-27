const jwt = require('jsonwebtoken');

// Middleware to validate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //const decoded2 = json.decode(token);
        req.user = decoded; // Add the decoded user to the request for further use
        console.log("Decoded JWT:", req.user);
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token.' });
    }
};

// Middleware to check user role
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        console.log('role name:', req.user.role_name);
        if (!req.user || !allowedRoles.includes(req.user.role_name)) {
            return res.status(403).json({ message: 'Access denied. User role is not authorized.' });
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRoles
};
