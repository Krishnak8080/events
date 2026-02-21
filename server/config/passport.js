/**
 * Passport.js Google OAuth 2.0 Strategy Configuration
 * Handles Google sign-in for admin dashboard access
 */
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Serialize user into session (store entire Google profile)
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Google OAuth 2.0 strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
        },
        (accessToken, refreshToken, profile, done) => {
            // Extract relevant user info from Google profile
            const user = {
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails?.[0]?.value || '',
                avatar: profile.photos?.[0]?.value || '',
            };
            return done(null, user);
        }
    )
);

module.exports = passport;
