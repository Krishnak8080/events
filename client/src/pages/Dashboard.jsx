/**
 * Dashboard Page — Admin Dashboard (Protected)
 * Event management with filters, table view, preview panel, and import functionality
 * Requires Google OAuth authentication
 */
import { useState, useEffect, useCallback } from 'react';
import FilterBar from '../components/FilterBar';
import EventTable from '../components/EventTable';
import PreviewPanel from '../components/PreviewPanel';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { API_URL } from '../config';

const Dashboard = ({ user, loading: authLoading }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        keyword: '',
        city: 'Sydney',
        startDate: '',
        endDate: '',
        status: '',
    });

    /**
     * Fetch events with current filters
     */
    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 25 });
            if (filters.keyword) params.set('keyword', filters.keyword);
            if (filters.city) params.set('city', filters.city);
            if (filters.startDate) params.set('startDate', filters.startDate);
            if (filters.endDate) params.set('endDate', filters.endDate);
            if (filters.status) params.set('status', filters.status);

            const res = await fetch(`${API_URL}/api/events?${params}`, { credentials: 'include' });
            const data = await res.json();
            setEvents(data.events || []);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    }, [page, filters]);

    useEffect(() => {
        if (!authLoading && user) {
            fetchEvents();
        }
    }, [fetchEvents, authLoading, user]);

    /**
     * Handle filter changes (debounced for keyword)
     */
    const [filterTimeout, setFilterTimeout] = useState(null);
    const handleFilterChange = (newFilters) => {
        if (filterTimeout) clearTimeout(filterTimeout);
        const timeout = setTimeout(() => {
            setFilters(newFilters);
            setPage(1);
        }, 300);
        setFilterTimeout(timeout);
    };

    /**
     * Handle event import
     */
    const handleImport = async (eventId, importNotes) => {
        try {
            const res = await fetch(`${API_URL}/api/events/${eventId}/import`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ importNotes }),
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.error || 'Import failed');
                return;
            }

            const data = await res.json();

            // Update local state
            setEvents((prev) =>
                prev.map((e) => (e._id === eventId ? data.event : e))
            );
            setSelectedEvent(data.event);
        } catch (error) {
            console.error('Import failed:', error);
            alert('Import failed. Please try again.');
        }
    };

    /**
     * Trigger manual scrape
     */
    const handleTriggerScrape = async () => {
        try {
            const res = await fetch(`${API_URL}/api/scrape`, {
                method: 'POST',
                credentials: 'include',
            });
            const data = await res.json();
            alert(data.message || 'Scrape triggered!');
            // Refresh events after a short delay
            setTimeout(fetchEvents, 3000);
        } catch (error) {
            alert('Failed to trigger scrape');
        }
    };

    // ── Auth Loading State ──────────────────────────────────
    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    // ── Unauthenticated State ───────────────────────────────
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center glass rounded-2xl p-10 max-w-md">
                    <svg className="w-16 h-16 mx-auto text-dark-500 mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-dark-100 mb-2">Admin Dashboard</h2>
                    <p className="text-dark-400 text-sm mb-6">
                        Sign in with your Google account to access the event management dashboard.
                    </p>
                    <GoogleLoginButton />
                </div>
            </div>
        );
    }

    // ── Authenticated Dashboard ─────────────────────────────
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-dark-100">Event Dashboard</h1>
                    <p className="text-sm text-dark-500 mt-1">
                        Manage and import scraped events
                        {pagination && (
                            <span> · <span className="text-dark-300 font-medium">{pagination.total}</span> total events</span>
                        )}
                    </p>
                </div>
                <button
                    onClick={handleTriggerScrape}
                    className="btn-primary flex items-center gap-2"
                    id="trigger-scrape"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Run Scraper
                </button>
            </div>

            {/* Filters */}
            <FilterBar filters={filters} onFilterChange={handleFilterChange} />

            {/* Content Area */}
            <div className={`transition-all ${selectedEvent ? 'mr-[440px]' : ''}`}>
                {loading ? (
                    <div className="glass rounded-xl p-12 text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
                        <p className="text-dark-500">Loading events...</p>
                    </div>
                ) : (
                    <>
                        <EventTable
                            events={events}
                            selectedId={selectedEvent?._id}
                            onSelectEvent={setSelectedEvent}
                        />

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4 px-2">
                                <span className="text-sm text-dark-500">
                                    Page {page} of {pagination.totalPages}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page <= 1}
                                        className="px-3 py-1.5 rounded-lg glass text-sm text-dark-400 disabled:opacity-30 hover:bg-dark-700/50 transition-all"
                                    >
                                        ←
                                    </button>
                                    <button
                                        onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                        disabled={page >= pagination.totalPages}
                                        className="px-3 py-1.5 rounded-lg glass text-sm text-dark-400 disabled:opacity-30 hover:bg-dark-700/50 transition-all"
                                    >
                                        →
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Preview Panel */}
            {selectedEvent && (
                <PreviewPanel
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onImport={handleImport}
                />
            )}
        </div>
    );
};

export default Dashboard;
