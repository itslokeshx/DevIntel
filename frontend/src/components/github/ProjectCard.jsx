import React from 'react';
import { Star, GitFork, Code, Calendar, TrendingUp } from 'lucide-react';

/**
 * Enhanced ProjectCard with quality score and better stats display
 */
export default function ProjectCard({ repo }) {
    const getStatusConfig = (maturityStage) => {
        const configs = {
            active: { color: 'green', icon: '🟢', label: 'Active' },
            stable: { color: 'blue', icon: '🔵', label: 'Maintained' },
            maintained: { color: 'blue', icon: '🔵', label: 'Maintained' },
            mature: { color: 'blue', icon: '🔵', label: 'Mature' },
            abandoned: { color: 'gray', icon: '⚫', label: 'Archived' },
            idea: { color: 'purple', icon: '🟣', label: 'Idea' }
        };
        return configs[maturityStage] || configs.active;
    };

    const getQualityColor = (score) => {
        if (score >= 80) return 'from-green-500 to-emerald-500';
        if (score >= 60) return 'from-blue-500 to-cyan-500';
        if (score >= 40) return 'from-yellow-500 to-orange-500';
        return 'from-orange-500 to-red-500';
    };

    const getDocsBadge = (quality) => {
        const badges = {
            excellent: { label: 'Excellent Docs', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
            good: { label: 'Good Docs', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
            basic: { label: 'Basic Docs', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' }
        };
        return badges[quality];
    };

    const status = getStatusConfig(repo.maturityStage);
    const qualityColor = getQualityColor(repo.healthScore);
    const docsBadge = getDocsBadge(repo.documentationQuality);

    // Get description (AI summary, GitHub description, or fallback)
    const description = repo.aiSummary || repo.description || `${repo.language || 'Software'} project with ${repo.stars} stars`;

    // Calculate time ago
    const getTimeAgo = (date) => {
        if (!date) return 'Unknown';
        const days = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        if (days < 365) return `${Math.floor(days / 30)} months ago`;
        return `${Math.floor(days / 365)} years ago`;
    };

    return (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 border border-border-light dark:border-border-dark hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl font-bold text-primary-600 dark:text-primary-400 hover:underline"
                    >
                        {repo.name}
                    </a>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                    status.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        status.color === 'purple' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                    {status.icon} {status.label}
                </span>
            </div>

            {/* Description */}
            <div className="mb-4">
                {repo.aiStory && (
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            ✨ AI INSIGHT
                        </span>
                    </div>
                )}
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm line-clamp-3">
                    {repo.aiStory || description}
                </p>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-4 mb-4 text-sm text-text-tertiary-light dark:text-text-tertiary-dark flex-wrap">
                {repo.stars > 0 && (
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{repo.stars}</span>
                    </div>
                )}
                {repo.forks > 0 && (
                    <div className="flex items-center gap-1">
                        <GitFork className="w-4 h-4 text-blue-500" />
                        <span>{repo.forks}</span>
                    </div>
                )}
                {repo.language && (
                    <div className="flex items-center gap-1">
                        <Code className="w-4 h-4 text-purple-500" />
                        <span>{repo.language}</span>
                    </div>
                )}
                <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{getTimeAgo(repo.pushedAt)}</span>
                </div>
                {repo.commitCount > 0 && (
                    <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span>{repo.commitCount} commits</span>
                    </div>
                )}
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
                {docsBadge && (
                    <span className={`px-2 py-1 text-xs font-medium rounded ${docsBadge.color}`}>
                        {docsBadge.label}
                    </span>
                )}
                {repo.hasLicense && (
                    <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        Licensed
                    </span>
                )}
                {repo.commitFrequency === 'active' && (
                    <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        Recent Activity
                    </span>
                )}
            </div>

            {/* Quality Score */}
            <div>
                <div className="flex items-center justify-between text-xs text-text-tertiary-light dark:text-text-tertiary-dark mb-2">
                    <span className="font-medium">Project Quality</span>
                    <span className="font-bold">{repo.healthScore}/100</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${qualityColor} transition-all duration-1000 ease-out`}
                        style={{ width: `${repo.healthScore}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
