import React from 'react';

export function SkeletonStats({ count = 4, columns = 4 }) {
    return (
        <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-4`}>
            {[...Array(count)].map((_, i) => (
                <div
                    key={i}
                    className="bg-gray-800/50 rounded-xl p-4 relative overflow-hidden"
                >
                    {/* Stat value */}
                    <div className="h-8 bg-gray-700/50 rounded w-16 mb-2 animate-pulse" />

                    {/* Stat label */}
                    <div className="h-3 bg-gray-700/50 rounded w-24 animate-pulse" />

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>
            ))}
        </div>
    );
}

export function SkeletonChart({ height = '300px' }) {
    return (
        <div
            className="bg-gray-800/50 rounded-xl p-6 relative overflow-hidden"
            style={{ height }}
        >
            {/* Chart bars */}
            <div className="flex items-end justify-around h-full gap-2">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-gray-700/50 rounded-t animate-pulse"
                        style={{
                            height: `${Math.random() * 60 + 40}%`,
                            width: '100%'
                        }}
                    />
                ))}
            </div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
    );
}

export function SkeletonHeatmap() {
    return (
        <div className="bg-gray-800/50 rounded-xl p-6 relative overflow-hidden">
            {/* Title */}
            <div className="h-5 bg-gray-700/50 rounded w-48 mb-4 animate-pulse" />

            {/* Heatmap grid */}
            <div className="space-y-1">
                {[...Array(7)].map((_, row) => (
                    <div key={row} className="flex gap-1">
                        {[...Array(53)].map((_, col) => (
                            <div
                                key={col}
                                className="w-3 h-3 bg-gray-700/50 rounded-sm animate-pulse"
                                style={{
                                    animationDelay: `${(row * 53 + col) * 2}ms`
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 mt-4">
                <div className="h-3 bg-gray-700/50 rounded w-16 animate-pulse" />
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-gray-700/50 rounded-sm animate-pulse" />
                    ))}
                </div>
                <div className="h-3 bg-gray-700/50 rounded w-16 animate-pulse" />
            </div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
    );
}

export function SkeletonList({ items = 5 }) {
    return (
        <div className="space-y-3">
            {[...Array(items)].map((_, i) => (
                <div
                    key={i}
                    className="bg-gray-800/50 rounded-lg p-4 flex items-center gap-4 relative overflow-hidden"
                >
                    {/* Icon/Avatar */}
                    <div className="w-12 h-12 bg-gray-700/50 rounded-lg animate-pulse" />

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-700/50 rounded w-3/4 animate-pulse" />
                        <div className="h-3 bg-gray-700/50 rounded w-1/2 animate-pulse" />
                    </div>

                    {/* Trailing element */}
                    <div className="w-16 h-8 bg-gray-700/50 rounded animate-pulse" />

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>
            ))}
        </div>
    );
}
