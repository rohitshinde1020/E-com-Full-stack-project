const jwt = require('jsonwebtoken');

const adminauth = (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization;
        const token = req.headers.token || (bearerToken && bearerToken.startsWith('Bearer ') ? bearerToken.split(' ')[1] : null);

        if (!token) {
            return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.id !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(403).json({ success: false, message: 'Access denied. Invalid credentials.' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid token.' });
    }
};

module.exports = adminauth;