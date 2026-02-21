/**
 * Email Capture API Routes
 * Handles saving email leads from the "GET TICKETS" modal
 */
const express = require('express');
const router = express.Router();
const EmailLead = require('../models/EmailLead');

/**
 * POST /api/emails
 * Save an email lead with consent status and event reference
 * Body: { email, consent, eventId }
 */
router.post('/', async (req, res) => {
    try {
        const { email, consent, eventId } = req.body;

        // Validate required fields
        if (!email || !eventId) {
            return res.status(400).json({ error: 'Email and eventId are required' });
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const emailLead = await EmailLead.create({
            email,
            consent: consent || false,
            eventId,
        });

        res.status(201).json({
            message: 'Email captured successfully',
            lead: emailLead,
        });
    } catch (error) {
        console.error('Error saving email lead:', error.message);
        res.status(500).json({ error: 'Failed to save email' });
    }
});

/**
 * GET /api/emails
 * List all email leads (admin only — add auth middleware in production)
 */
router.get('/', async (req, res) => {
    try {
        const leads = await EmailLead.find()
            .populate('eventId', 'title sourceName')
            .sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        console.error('Error fetching leads:', error.message);
        res.status(500).json({ error: 'Failed to fetch email leads' });
    }
});

module.exports = router;
