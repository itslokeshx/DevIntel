import React from 'react';
import { Search } from 'lucide-react';

export function RepoFilters({
    repositories = [],
    filter,
    setFilter,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery
}) {
    const counts = {
        all: repositories.length,
        active: repositories.filter(r => r.maturityStage === 'active').length,
        stable: repositories.filter(r => r.maturityStage === 'stable').length,
        archived: repositories.filter(r => r.isArchived).length
    };

    const filterButtons = [
        { value: 'all', label: 'All', count: counts.all },
        { value: 'active', label: 'Active', count: counts.active },
        { value: 'stable', label: 'Stable', count: counts.stable },
        { value: 'archived', label: 'Archived', count: counts.archived }
    ];

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
                {filterButtons.map(btn => (
                    <button
                        key={btn.value}
                        onClick={() => setFilter(btn.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === btn.value
                                ? 'bg-primary-500 text-white shadow-md'
                                : 'bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary'
                            }`}
                    >
                        {btn.label}
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filter === btn.value
                                ? 'bg-white/20'
                                : 'bg-light-bg-primary dark:bg-dark-bg-primary'
                            }`}>
                            {btn.count}
                        </span>
                    </button>
                ))}
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
                {/* Sort Dropdown */}
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary border border-light-border dark:border-dark-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="updated">Recently Updated</option>
                    <option value="created">Recently Created</option>
                    <option value="stars">Most Stars</option>
                    <option value="commits">Most Commits</option>
                    <option value="quality">Quality Score</option>
                </select>

                {/* Search Input */}
                <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
                    <input
                        type="text"
                        placeholder="Search repositories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary border border-light-border dark:border-dark-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            </div>
        </div>
    );
}
