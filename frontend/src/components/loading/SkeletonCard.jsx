import React from 'react';
import { motion } from 'framer-motion';

export function SkeletonCard({ className = '' }) {
    return (
        <div className={`bg-gray-800/50 rounded-xl p-6 ${className}`}>
            {/* Header with avatar and name */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-700/50 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700/50 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-700/50 rounded w-1/2 animate-pulse" />
                </div>
            </div>

            {/* Content lines */}
            <div className="space-y-3 mb-6">
                <div className="h-3 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-3 bg-gray-700/50 rounded w-5/6 animate-pulse" />
                <div className="h-3 bg-gray-700/50 rounded w-4/6 animate-pulse" />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-6 bg-gray-700/50 rounded w-12 animate-pulse" />
                        <div className="h-2 bg-gray-700/50 rounded w-16 animate-pulse" />
                    </div>
                ))}
            </div>

            {/* Shimmer overlay */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
    );
}

export function SkeletonProfileCard() {
    return (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 relative overflow-hidden">
            {/* Large avatar */}
            <div className="flex justify-center mb-6">
                <div className="w-32 h-32 bg-gray-700/50 rounded-full animate-pulse" />
            </div>

            {/* Name and username */}
            <div className="text-center mb-6 space-y-2">
                <div className="h-6 bg-gray-700/50 rounded w-48 mx-auto animate-pulse" />
                <div className="h-4 bg-gray-700/50 rounded w-32 mx-auto animate-pulse" />
            </div>

            {/* Bio */}
            <div className="space-y-2 mb-6">
                <div className="h-3 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-3 bg-gray-700/50 rounded w-5/6 mx-auto animate-pulse" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-700/30 rounded-lg p-3 space-y-2">
                        <div className="h-8 bg-gray-700/50 rounded w-16 mx-auto animate-pulse" />
                        <div className="h-3 bg-gray-700/50 rounded w-20 mx-auto animate-pulse" />
                    </div>
                ))}
            </div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
        </div>
    );
}

export function SkeletonComparisonCard() {
    return (
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-6 border border-blue-500/20 relative overflow-hidden">
            {/* Two fighter cards side by side */}
            <div className="grid grid-cols-2 gap-6 mb-6">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="space-y-4">
                        <div className="w-24 h-24 bg-gray-700/50 rounded-full mx-auto animate-pulse" />
                        <div className="h-4 bg-gray-700/50 rounded w-32 mx-auto animate-pulse" />
                        <div className="h-3 bg-gray-700/50 rounded w-24 mx-auto animate-pulse" />
                    </div>
                ))}
            </div>

            {/* VS divider */}
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gray-700/50 rounded-full animate-pulse" />
            </div>

            {/* Metrics */}
            <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-700/30 rounded-lg animate-pulse" />
                ))}
            </div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
        </div>
    );
}
