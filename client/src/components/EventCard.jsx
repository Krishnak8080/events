/**
 * EventCard Component
 * Displays a single event as a visually rich card on the public listing
 */
const EventCard = ({ event, onGetTickets }) => {
    /**
     * Format source name into a colored badge
     */
    const getSourceColor = (source) => {
        switch (source?.toLowerCase()) {
            case 'eventbrite':
                return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
            case 'meetup':
                return 'bg-red-500/15 text-red-400 border-red-500/30';
            default:
                return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
        }
    };

    return (
        <div className="glass-card overflow-hidden group animate-slide-up">
            {/* Event Image */}
            <div className="relative h-48 overflow-hidden bg-dark-800">
                {event.imageUrl ? (
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                {/* Fallback gradient placeholder */}
                <div
                    className={`w-full h-full bg-gradient-to-br from-primary-600/30 to-accent-600/30 flex items-center justify-center ${event.imageUrl ? 'hidden' : 'flex'}`}
                >
                    <svg className="w-16 h-16 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>

                {/* Source Badge */}
                <div className="absolute top-3 right-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getSourceColor(event.sourceName)}`}>
                        {event.sourceName}
                    </span>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex flex-col gap-3">
                {/* Title */}
                <h3 className="text-lg font-semibold text-dark-100 line-clamp-2 leading-tight">
                    {event.title}
                </h3>

                {/* Date & Venue Info */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-sm text-dark-400">
                        <svg className="w-4 h-4 text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{event.dateTime || 'TBA'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-dark-400">
                        <svg className="w-4 h-4 text-accent-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{event.venueName || 'TBA'}</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-dark-500 line-clamp-2 min-h-[2.5rem]">
                    {event.description}
                </p>

                {/* CTA Button */}
                <button
                    onClick={() => onGetTickets(event)}
                    className="btn-primary w-full mt-auto text-center"
                    id={`get-tickets-${event._id}`}
                >
                    🎟️ GET TICKETS
                </button>
            </div>
        </div>
    );
};

export default EventCard;
