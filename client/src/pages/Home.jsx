/**
 * Home Page — Public Event Listing
 * Displays events in a responsive card grid with search and email capture modal
 */
import { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import EmailModal from '../components/EmailModal';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    /**
     * Fetch events from the API
     */
    const fetchEvents = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page,
                limit: 12,
                ...(search && { keyword: search }),
            });
            const res = await fetch(`/api/events?${params}`);
            const data = await res.json();
            setEvents(data.events || []);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [page, search]);

    // Debounced search
    const [searchTimeout, setSearchTimeout] = useState(null);
    const handleSearchChange = (value) => {
        if (searchTimeout) clearTimeout(searchTimeout);
        const timeout = setTimeout(() => {
            setSearch(value);
            setPage(1);
        }, 400);
        setSearchTimeout(timeout);
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="hero-glow" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                            Discover Sydney
                            <span className="block gradient-text mt-1">Events</span>
                        </h1>
                        <p className="text-lg text-dark-400 max-w-xl mx-auto mb-8">
                            Find the best concerts, meetups, festivals, and experiences happening across Sydney, Australia.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-lg mx-auto relative">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                id="home-search"
                                type="text"
                                placeholder="Search events, venues, topics..."
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full pl-12 pr-6 py-3.5 rounded-xl glass text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-base transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {/* Results Count */}
                {pagination && (
                    <p className="text-sm text-dark-500 mb-6">
                        Showing <span className="text-dark-300 font-medium">{events.length}</span> of{' '}
                        <span className="text-dark-300 font-medium">{pagination.total}</span> events
                    </p>
                )}

                {loading ? (
                    /* Loading Skeleton */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="glass-card animate-pulse-soft">
                                <div className="h-48 bg-dark-800 rounded-t-xl" />
                                <div className="p-5 space-y-3">
                                    <div className="h-5 bg-dark-700 rounded w-3/4" />
                                    <div className="h-4 bg-dark-700 rounded w-1/2" />
                                    <div className="h-4 bg-dark-700 rounded w-2/3" />
                                    <div className="h-10 bg-dark-700 rounded-lg mt-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : events.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-20">
                        <svg className="w-20 h-20 mx-auto text-dark-700 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-dark-400 mb-2">No events found</h3>
                        <p className="text-dark-600">
                            {search
                                ? 'Try a different search term'
                                : 'Events will appear here once the scraper runs'}
                        </p>
                    </div>
                ) : (
                    /* Event Cards */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {events.map((event) => (
                            <EventCard
                                key={event._id}
                                event={event}
                                onGetTickets={setSelectedEvent}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1}
                            className="px-4 py-2 rounded-lg glass text-sm font-medium text-dark-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-700/50 transition-all"
                        >
                            ← Previous
                        </button>
                        <span className="text-sm text-dark-500 px-4">
                            Page {page} of {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                            disabled={page >= pagination.totalPages}
                            className="px-4 py-2 rounded-lg glass text-sm font-medium text-dark-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-700/50 transition-all"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>

            {/* Email Capture Modal */}
            {selectedEvent && (
                <EmailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
            )}
        </div>
    );
};

export default Home;
