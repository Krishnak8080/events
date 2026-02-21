/**
 * Sydney Events — Express Server Entry Point
 * Wires up middleware, routes, Passport auth, cron scheduler, and MongoDB
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./config/passport');
const connectDB = require('./config/db');
const { startScheduler, runAllScrapers } = require('./cron/scheduler');

// ── Import route modules ────────────────────────────────
const eventsRoutes = require('./routes/events');
const emailsRoutes = require('./routes/emails');
const authRoutes = require('./routes/auth');
const importRoutes = require('./routes/import');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Core Middleware ─────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS — allow requests from React frontend (dev and production)
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (mobile apps, curl, etc.)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true, // Allow cookies for session-based auth
    })
);

// ── Session Configuration ───────────────────────────────
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'default-secret-change-me',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/sydney-events',
            ttl: 24 * 60 * 60, // Sessions expire after 24 hours
        }),
        cookie: {
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        },
    })
);

// ── Passport.js Initialization ──────────────────────────
app.use(passport.initialize());
app.use(passport.session());

// ── API Routes ──────────────────────────────────────────
app.use('/api/events', eventsRoutes);
app.use('/api/emails', emailsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', importRoutes); // PUT /api/events/:id/import

// ── Health Check ────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ── Manual Scrape Trigger (for development/testing) ─────
app.post('/api/scrape', async (req, res) => {
    try {
        await runAllScrapers();
        res.json({ message: 'Scrape triggered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Scrape failed', details: error.message });
    }
});

// ── Start Server ────────────────────────────────────────
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start Express server
        app.listen(PORT, () => {
            console.log(`\n🌐 Server running on http://localhost:${PORT}`);
            console.log(`📡 API available at http://localhost:${PORT}/api`);
        });

        // Start the cron scheduler for automatic scraping
        const cronSchedule = process.env.CRON_SCHEDULE || '0 */6 * * *';
        startScheduler(cronSchedule);
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
