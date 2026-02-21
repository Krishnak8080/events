/**
 * Import Action API Routes
 * Handles "Import to Platform" action from the admin dashboard
 */
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { ensureAuth } = require('../middleware/auth');

/**
 * PUT /api/events/:id/import
 * Mark an event as "imported" with metadata
 * Body: { importNotes } (optional)
 * Requires authentication
 */
router.put('/:id/import', ensureAuth, async (req, res) => {
    try {
        const { importNotes } = req.body;
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        event.status = 'imported';
        event.importedAt = new Date();
        event.importedBy = req.user?.displayName || req.user?.email || 'Unknown';
        event.importNotes = importNotes || '';

        await event.save();

        res.json({
            message: 'Event imported successfully',
            event,
        });
    } catch (error) {
        console.error('Error importing event:', error.message);
        res.status(500).json({ error: 'Failed to import event' });
    }
});

module.exports = router;
