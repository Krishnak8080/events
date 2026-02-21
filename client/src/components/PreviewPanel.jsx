/**
 * PreviewPanel Component
 * Slide-out panel showing full event details with import functionality
 */
import { useState } from 'react';

const PreviewPanel = ({ event, onClose, onImport }) => {
    const [importNotes, setImportNotes] = useState('');
    const [isImporting, setIsImporting] = useState(false);

    if (!event) return null;

    /**
     * Handle "Import to Platform" action
     */
    const handleImport = async () => {
        setIsImporting(true);
        try {
            await onImport(event._id, importNotes);
            setImportNotes('');
        } finally {
            setIsImporting(false);
        }
    };

    /**
     * Get CSS class for status badge
     */
    const getStatusClass = (status) => {
        switch (status) {
            case 'new': return 'status-badge status-new';
            case 'updated': return 'status-badge status-updated';
            case 'inactive': return 'status-badge status-inactive';
            case 'imported': return 'status-badge status-imported';
            default: return 'status-badge bg-dark-700 text-dark-400';
        }
    };

    return (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[440px] glass border-l border-dark-700/50 z-30 animate-slide-in overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 glass border-b border-dark-700/50 px-6 py-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-dark-100">Event Details</h2>
                <button
                    onClick={onClose}
                    className="text-dark-500 hover:text-dark-300 transition-colors p-1"
                    id="close-preview"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="p-6 flex flex-col gap-5">
                {/* Event Image */}
                {event.imageUrl && (
                    <div className="rounded-xl overflow-hidden h-52">
                        <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.target.parentElement.style.display = 'none')}
                        />
                    </div>
                )}

                {/* Title & Status */}
                <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-xl font-bold text-dark-50 leading-tight">{event.title}</h3>
                        <span className={getStatusClass(event.status)}>{event.status}</span>
                    </div>
                    <span className="text-xs text-dark-500">ID: {event._id}</span>
                </div>

                {/* Detail Fields */}
                <div className="space-y-3">
                    <DetailRow icon="📅" label="Date/Time" value={event.dateTime || 'TBA'} />
                    <DetailRow icon="📍" label="Venue" value={event.venueName || 'TBA'} />
                    {event.venueAddress && (
                        <DetailRow icon="🗺️" label="Address" value={event.venueAddress} />
                    )}
                    <DetailRow icon="🏙️" label="City" value={event.city} />
                    <DetailRow icon="🏷️" label="Category" value={event.category || 'General'} />
                    <DetailRow icon="🌐" label="Source" value={event.sourceName} />
                    <DetailRow
                        icon="🔗"
                        label="URL"
                        value={
                            <a
                                href={event.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-400 hover:text-primary-300 underline break-all text-sm"
                            >
                                View Original →
                            </a>
                        }
                    />
                    {event.lastScraped && (
                        <DetailRow icon="⏱️" label="Last Scraped" value={new Date(event.lastScraped).toLocaleString()} />
                    )}
                </div>

                {/* Description */}
                <div>
                    <h4 className="text-sm font-semibold text-dark-300 mb-2">Description</h4>
                    <p className="text-sm text-dark-400 leading-relaxed bg-dark-800/50 rounded-lg p-3">
                        {event.description || 'No description available.'}
                    </p>
                </div>

                {/* Import Section */}
                {event.status === 'imported' ? (
                    <div className="bg-accent-500/10 border border-accent-500/20 rounded-xl p-4">
                        <p className="text-sm font-semibold text-accent-400 mb-2">✅ Imported</p>
                        <p className="text-xs text-dark-400">
                            By: {event.importedBy} · {event.importedAt && new Date(event.importedAt).toLocaleString()}
                        </p>
                        {event.importNotes && (
                            <p className="text-xs text-dark-500 mt-1">Notes: {event.importNotes}</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3 pt-2">
                        <textarea
                            id="import-notes"
                            placeholder="Add import notes (optional)..."
                            value={importNotes}
                            onChange={(e) => setImportNotes(e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2.5 rounded-lg bg-dark-800 border border-dark-600 text-dark-200 placeholder-dark-500 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 text-sm resize-none transition-all"
                        />
                        <button
                            onClick={handleImport}
                            disabled={isImporting}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-accent-500 to-primary-500 text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            id="import-button"
                        >
                            {isImporting ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Importing...
                                </>
                            ) : (
                                '📥 Import to Platform'
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * DetailRow — single key-value row in the preview panel
 */
const DetailRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
        <div className="min-w-0">
            <p className="text-xs text-dark-500 font-medium">{label}</p>
            <div className="text-sm text-dark-200 break-words">{value}</div>
        </div>
    </div>
);

export default PreviewPanel;
