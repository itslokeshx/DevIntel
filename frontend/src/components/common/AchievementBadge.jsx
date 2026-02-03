import React from 'react';

/**
 * AchievementBadge - Display achievement badges with icons and tooltips
 */
export default function AchievementBadge({ icon, title, description, unlocked = true }) {
    return (
        <div
            className={`group relative inline-flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-300 ${unlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-700 hover:shadow-lg hover:scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-50'
                }`}
        >
            {/* Icon */}
            <span className="text-2xl">{icon}</span>

            {/* Title */}
            <span className={`text-sm font-semibold ${unlocked
                    ? 'text-yellow-800 dark:text-yellow-200'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                {title}
            </span>

            {/* Tooltip */}
            {description && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    {description}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
                </div>
            )}
        </div>
    );
}
