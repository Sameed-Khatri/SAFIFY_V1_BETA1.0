const jwt = require('jsonwebtoken');
const loginService = require('../services/loginService');

// Middleware to validate token
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided.' });
    }

    let decoded;
    try {
        decoded = jwt.decode(token); // Decode the token without verifying
        req.user = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        console.log("Decoded JWT:", req.user);
        const user_id = req.user.user_id;
        console.log("user id: ", user_id);
        next();
    } catch (error) {
        const user_id = decoded ? decoded.user_id : null; // Extract user_id from the decoded token
        if (user_id) {
            const result = await loginService.updateLoginsAllowed(user_id, 1);
            console.log(result);
        }
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
