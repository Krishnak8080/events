/**
 * Events API Routes
 * Handles fetching events with filters and search
 */
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

/**
 * GET /api/events
 * List events with optional filters: city, keyword, date range, status
 * Query params: ?city=Sydney&keyword=music&startDate=2024-01-01&endDate=2024-12-31&status=new&page=1&limit=20
 */
router.get('/', async (req, res) => {
    try {
        const {
            city,
            keyword,
            startDate,
            endDate,
            status,
            page = 1,
            limit = 20,
        } = req.query;

        const filter = {};

        // City filter (default: Sydney)
        if (city) {
            filter.city = { $regex: city, $options: 'i' };
        }

        // Keyword search across title, venue, and description
        if (keyword) {
            filter.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { venueName: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ];
        }

        // Date range filter
        if (startDate || endDate) {
            filter.dateTime = {};
            if (startDate) filter.dateTime.$gte = startDate;
            if (endDate) filter.dateTime.$lte = endDate;
        }

        // Status filter
        if (status) {
            filter.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Event.countDocuments(filter);
        const events = await Event.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            events,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error('Error fetching events:', error.message);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

/**
 * GET /api/events/:id
 * Get a single event by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        console.error('Error fetching event:', error.message);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
});

module.exports = router;
