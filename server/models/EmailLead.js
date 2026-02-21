/**
 * EmailLead Model — Mongoose Schema
 * Stores email leads captured from the "GET TICKETS" modal
 */
const mongoose = require('mongoose');

const emailLeadSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        consent: {
            type: Boolean,
            required: true,
            default: false,
        },
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
        },
    },
    {
        timestamps: true, // Adds createdAt, updatedAt
    }
);

module.exports = mongoose.model('EmailLead', emailLeadSchema);
