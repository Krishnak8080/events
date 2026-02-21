/**
 * FilterBar Component
 * Provides filters for the admin dashboard: city, keyword search, date range
 */
import { useState } from 'react';

const FilterBar = ({ filters, onFilterChange }) => {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleChange = (field, value) => {
        const updated = { ...localFilters, [field]: value };
        setLocalFilters(updated);
        onFilterChange(updated);
    };

    return (
        <div className="glass rounded-xl p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* Keyword Search */}
                <div className="lg:col-span-2 relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        id="search-keyword"
                        type="text"
                        placeholder="Search events by title, venue, description..."
                        value={localFilters.keyword}
                        onChange={(e) => handleChange('keyword', e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-dark-800 border border-dark-600 text-dark-200 placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 text-sm transition-all"
                    />
                </div>

                {/* City Filter */}
                <select
                    id="filter-city"
                    value={localFilters.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="px-3 py-2.5 rounded-lg bg-dark-800 border border-dark-600 text-dark-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 cursor-pointer transition-all"
                >
                    <option value="">All Cities</option>
                    <option value="Sydney">Sydney</option>
                    <option value="Melbourne">Melbourne</option>
                    <option value="Brisbane">Brisbane</option>
                    <option value="Perth">Perth</option>
                </select>

                {/* Start Date */}
                <input
                    id="filter-start-date"
                    type="date"
                    value={localFilters.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="px-3 py-2.5 rounded-lg bg-dark-800 border border-dark-600 text-dark-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                    title="Start Date"
                />

                {/* End Date */}
                <input
                    id="filter-end-date"
                    type="date"
                    value={localFilters.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    className="px-3 py-2.5 rounded-lg bg-dark-800 border border-dark-600 text-dark-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                    title="End Date"
                />
            </div>

            {/* Status Quick Filters */}
            <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-dark-500 font-medium mr-1">Status:</span>
                {['', 'new', 'updated', 'inactive', 'imported'].map((status) => (
                    <button
                        key={status}
                        onClick={() => handleChange('status', status)}
                        className={`text-xs px-3 py-1 rounded-full border transition-all ${localFilters.status === status
                                ? 'bg-primary-500/20 border-primary-500/40 text-primary-300'
                                : 'bg-dark-800 border-dark-600 text-dark-400 hover:border-dark-500'
                            }`}
                    >
                        {status || 'All'}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterBar;
