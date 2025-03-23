// middleware/auth.js

module.exports = (req, res, next) => {
    if (!req.session.userID) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
    next();
};