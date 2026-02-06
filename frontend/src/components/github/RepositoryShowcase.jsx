import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Star, GitFork, ExternalLink, TrendingUp } from 'lucide-react';

export function RepositoryShowcase({ repositories }) {
    const [showAll, setShowAll] = useState(false);

    if (!repositories || repositories.length === 0) {
        return null;
    }

    // Smart repository ranking: stars → recent activity → commits
    const rankedRepos = [...repositories]
        .filter(r => !r.fork && !r.archived) // Filter forks and archived
        .sort((a, b) => {
            // Primary: Stars
            if (b.stars !== a.stars) return b.stars - a.stars;

            // Secondary: Recent activity (days since update)
            const aDaysSinceUpdate = Math.floor((Date.now() - new Date(a.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
            const bDaysSinceUpdate = Math.floor((Date.now() - new Date(b.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
            if (aDaysSinceUpdate !== bDaysSinceUpdate) return aDaysSinceUpdate - bDaysSinceUpdate;

            // Tertiary: Commits
            return (b.commitCount || 0) - (a.commitCount || 0);
        });

    const displayRepos = showAll ? rankedRepos : rankedRepos.slice(0, 6);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">💼 Portfolio Showcase</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {rankedRepos.length} repositories
                </span>
            </div>

            {/* 3-column grid on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {displayRepos.map((repo, idx) => (
                    <motion.div
                        key={repo.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="relative group"
                    >
                        {/* Gradient border on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />

                        <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 h-full flex flex-col hover:shadow-2xl transition-all">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">
                                        {repo.name}
                                    </h4>
                                    {repo.language && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: getLanguageColor(repo.language) }}
                                            />
                                            {repo.language}
                                        </div>
                                    )}
                                </div>
                                {repo.stars > 0 && (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                        <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400 fill-yellow-600 dark:fill-yellow-400" />
                                        <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                                            {repo.stars}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Description or AI Story */}
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-1">
                                {repo.aiStory || repo.description || 'No description available'}
                            </p>

                            {/* Stats */}
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                {repo.forks > 0 && (
                                    <span className="flex items-center gap-1">
                                        <GitFork className="w-3 h-3" />
                                        {repo.forks}
                                    </span>
                                )}
                                {repo.commitCount > 0 && (
                                    <span className="flex items-center gap-1">
                                        <Code2 className="w-3 h-3" />
                                        {repo.commitCount} commits
                                    </span>
                                )}
                                {repo.healthScore && (
                                    <span className={`flex items-center gap-1 ${repo.healthScore > 75 ? 'text-green-600 dark:text-green-400' :
                                            repo.healthScore > 50 ? 'text-yellow-600 dark:text-yellow-400' :
                                                'text-gray-500 dark:text-gray-400'
                                        }`}>
                                        <TrendingUp className="w-3 h-3" />
                                        {repo.healthScore}% health
                                    </span>
                                )}
                            </div>

                            {/* View button */}
                            <a
                                href={repo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm group-hover:gap-3 transition-all"
                            >
                                View Repository
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Load more button */}
            {!showAll && rankedRepos.length > 6 && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAll(true)}
                    className="w-full py-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400 font-semibold rounded-xl hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all"
                >
                    Load {rankedRepos.length - 6} more repositories →
                </motion.button>
            )}
        </div>
    );
}

// Language color mapping
function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f7df1e',
        'TypeScript': '#3178c6',
        'Python': '#3776ab',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Java': '#b07219',
        'Go': '#00add8',
        'Rust': '#dea584',
        'PHP': '#4f5d95',
        'Ruby': '#cc342d',
        'Swift': '#fa7343',
        'Kotlin': '#7f52ff',
        'Dart': '#0175c2',
        'C++': '#00599c',
        'C': '#a8b9cc'
    };
    return colors[language] || '#888';
}
