/**
 * Google OAuth Authentication Routes
 * Handles Google sign-in, callback, user info, and logout
 */
const express = require('express');
const router = express.Router();
const passport = require('passport');

/**
 * GET /api/auth/google
 * Initiates Google OAuth 2.0 flow
 */
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
);

/**
 * GET /api/auth/google/callback
 * Google OAuth callback — redirects to frontend dashboard on success
 */
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/`,
    }),
    (req, res) => {
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard`);
    }
);

/**
 * GET /api/auth/user
 * Returns the currently authenticated user, or null
 */
router.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.json({ user: null });
    }
});

/**
 * GET /api/auth/logout
 * Logs out the user and destroys the session
 */
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        req.session.destroy(() => {
            res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
        });
    });
});

module.exports = router;
