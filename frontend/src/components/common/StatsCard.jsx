import React from 'react';

/**
 * StatsCard - Reusable stat display with icon, number, and optional progress bar
 */
export default function StatsCard({
    icon,
    value,
    label,
    sublabel,
    progress,
    badge,
    color = 'primary'
}) {
    const colorClasses = {
        primary: 'from-primary-500 to-primary-600',
        success: 'from-green-500 to-green-600',
        warning: 'from-orange-500 to-orange-600',
        fire: 'from-orange-500 to-red-500',
        star: 'from-yellow-400 to-yellow-500'
    };

    return (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 border border-border-light dark:border-border-dark hover:shadow-lg transition-all duration-300 hover:scale-105">
            {/* Icon and Badge */}
            <div className="flex items-start justify-between mb-3">
                <div className={`text-3xl bg-gradient-to-br ${colorClasses[color]} bg-clip-text text-transparent`}>
                    {icon}
                </div>
                {badge && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900">
                        {badge}
                    </span>
                )}
            </div>

            {/* Value */}
            <div className="mb-2">
                <div className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    {value}
                </div>
                <div className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mt-1">
                    {label}
                </div>
                {sublabel && (
                    <div className="text-xs text-text-tertiary-light dark:text-text-tertiary-dark mt-0.5">
                        {sublabel}
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            {progress !== undefined && (
                <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-text-tertiary-light dark:text-text-tertiary-dark mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-1000 ease-out`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
