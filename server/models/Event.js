/**
 * Event Model — Mongoose Schema
 * Stores scraped event data from Sydney event sources
 */
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        // ── Core Event Fields ────────────────────────────────
        title: {
            type: String,
            required: true,
            trim: true,
        },
        dateTime: {
            type: String, // Stored as string to handle varied formats from scraped sources
            default: 'TBA',
        },
        venueName: {
            type: String,
            trim: true,
            default: 'TBA',
        },
        venueAddress: {
            type: String,
            trim: true,
            default: '',
        },
        city: {
            type: String,
            default: 'Sydney',
        },
        description: {
            type: String,
            default: '',
        },
        category: {
            type: String,
            default: 'General',
        },
        imageUrl: {
            type: String,
            default: '',
        },

        // ── Source Tracking ──────────────────────────────────
        sourceName: {
            type: String,
            required: true,
        },
        sourceUrl: {
            type: String,
            required: true,
        },
        lastScraped: {
            type: Date,
            default: Date.now,
        },

        // ── Status Management ───────────────────────────────
        status: {
            type: String,
            enum: ['new', 'updated', 'inactive', 'imported'],
            default: 'new',
        },

        // ── Import Tracking (Admin Dashboard) ───────────────
        importedAt: {
            type: Date,
            default: null,
        },
        importedBy: {
            type: String, // Google user display name or email
            default: null,
        },
        importNotes: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true, // Adds createdAt, updatedAt
    }
);

// Compound index to prevent duplicate events from same source
eventSchema.index({ sourceUrl: 1 }, { unique: true });

// Text index for keyword search across title, venue, description
eventSchema.index({ title: 'text', venueName: 'text', description: 'text' });

module.exports = mongoose.model('Event', eventSchema);
