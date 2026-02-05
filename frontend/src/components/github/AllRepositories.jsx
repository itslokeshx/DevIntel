import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, GitFork, Code2, ExternalLink } from 'lucide-react';

export function AllRepositories({ repositories, onClose }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('updated'); // updated, stars, name
    
    const filteredRepos = repositories
        .filter(repo => 
            repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => {
            if (sortBy === 'stars') return (b.stars || 0) - (a.stars || 0);
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            // Default: updated
            return new Date(b.updatedAt || b.pushedAt) - new Date(a.updatedAt || a.pushedAt);
        });
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            All Repositories ({repositories.length})
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Browse and explore all repositories
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Search and Sort */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex gap-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search repositories..."
                        className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="updated">Recently Updated</option>
                        <option value="stars">Most Stars</option>
                        <option value="name">Name (A-Z)</option>
                    </select>
                </div>
                
                {/* Repositories List */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredRepos.map((repo, idx) => (
                            <motion.a
                                key={repo.name}
                                href={repo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg group"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {repo.name}
                                    </h3>
                                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                </div>
                                
                                {repo.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                        {repo.description}
                                    </p>
                                )}
                                
                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                                    {repo.language && (
                                        <span className="flex items-center gap-1">
                                            <Code2 className="w-3 h-3" />
                                            {repo.language}
                                        </span>
                                    )}
                                    {repo.stars > 0 && (
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3 h-3" />
                                            {repo.stars}
                                        </span>
                                    )}
                                    {repo.forks > 0 && (
                                        <span className="flex items-center gap-1">
                                            <GitFork className="w-3 h-3" />
                                            {repo.forks}
                                        </span>
                                    )}
                                    {repo.updatedAt && (
                                        <span>
                                            Updated {new Date(repo.updatedAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </motion.a>
                        ))}
                    </div>
                    
                    {filteredRepos.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">No repositories found</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

