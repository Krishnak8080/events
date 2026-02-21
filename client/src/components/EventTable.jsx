/**
 * EventTable Component
 * Displays events in a sortable table format for the admin dashboard
 */
const EventTable = ({ events, selectedId, onSelectEvent }) => {
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

    if (events.length === 0) {
        return (
            <div className="glass rounded-xl p-12 text-center">
                <svg className="w-16 h-16 mx-auto text-dark-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-dark-500 text-lg font-medium">No events found</p>
                <p className="text-dark-600 text-sm mt-1">Try adjusting your filters or trigger a scrape</p>
            </div>
        );
    }

    return (
        <div className="glass rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-dark-700">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider">Event</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider hidden lg:table-cell">Venue</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider hidden sm:table-cell">Source</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-800">
                        {events.map((event) => (
                            <tr
                                key={event._id}
                                onClick={() => onSelectEvent(event)}
                                className={`cursor-pointer transition-all hover:bg-dark-800/50 ${selectedId === event._id
                                        ? 'bg-primary-500/5 border-l-2 border-l-primary-500'
                                        : ''
                                    }`}
                            >
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        {event.imageUrl ? (
                                            <img
                                                src={event.imageUrl}
                                                alt=""
                                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                                onError={(e) => (e.target.style.display = 'none')}
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <span className="font-medium text-dark-200 line-clamp-1">{event.title}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-dark-400 hidden md:table-cell whitespace-nowrap">
                                    {event.dateTime || 'TBA'}
                                </td>
                                <td className="px-4 py-3 text-dark-400 hidden lg:table-cell">
                                    <span className="line-clamp-1">{event.venueName || 'TBA'}</span>
                                </td>
                                <td className="px-4 py-3 text-dark-400 hidden sm:table-cell">
                                    {event.sourceName}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={getStatusClass(event.status)}>
                                        {event.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EventTable;
