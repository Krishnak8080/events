/**
 * Authentication Middleware
 * Protects routes that require Google OAuth authentication
 */

/**
 * Ensures the user is authenticated via Passport.js session.
 * If not authenticated, returns 401 Unauthorized.
 */
const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ error: 'Unauthorized — please log in via Google' });
};

module.exports = { ensureAuth };
