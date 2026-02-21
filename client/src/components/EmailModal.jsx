/**
 * EmailModal Component
 * Captures user email with consent checkbox before redirecting to the event URL
 */
import { useState } from 'react';
import { API_URL } from '../config';

const EmailModal = ({ event, onClose }) => {
    const [email, setEmail] = useState('');
    const [consent, setConsent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    /**
     * Handle form submission:
     * 1. Save email lead via API
     * 2. Redirect to event source URL
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch(`${API_URL}/api/emails`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    consent,
                    eventId: event._id,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save email');
            }

            // Redirect to the original event URL
            window.open(event.sourceUrl, '_blank');
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="glass w-full max-w-md mx-4 rounded-2xl p-6 animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-dark-100">🎟️ Get Tickets</h2>
                    <button
                        onClick={onClose}
                        className="text-dark-500 hover:text-dark-300 transition-colors p-1"
                        id="close-modal"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Event Info */}
                <div className="bg-dark-800/60 rounded-lg p-3 mb-5">
                    <p className="text-sm font-medium text-dark-200">{event.title}</p>
                    <p className="text-xs text-dark-500 mt-1">
                        {event.dateTime} · {event.venueName}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email-input" className="block text-sm font-medium text-dark-300 mb-1.5">
                            Email Address
                        </label>
                        <input
                            id="email-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-2.5 rounded-lg bg-dark-800 border border-dark-600 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 text-sm transition-all"
                            autoFocus
                        />
                    </div>

                    {/* Consent Checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer group" htmlFor="consent-checkbox">
                        <input
                            id="consent-checkbox"
                            type="checkbox"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500/30 cursor-pointer"
                        />
                        <span className="text-xs text-dark-400 leading-relaxed group-hover:text-dark-300 transition-colors">
                            I agree to receive occasional event updates and newsletters. You can unsubscribe at any time.
                        </span>
                    </label>

                    {/* Error Message */}
                    {error && (
                        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        id="submit-email"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Redirecting...
                            </>
                        ) : (
                            'Continue to Tickets →'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EmailModal;
