import React from 'react';
import { ProgressRing } from '../common/ProgressRing';

/**
 * Animated level badge with progress ring
 */
export function LevelBadge({ level, tier, progress, totalXP }) {
    const getTierColor = (tier) => {
        const colors = {
            'Legendary': '#FFD700',
            'Master': '#9333EA',
            'Expert': '#3B82F6',
            'Advanced': '#10B981',
            'Intermediate': '#F59E0B',
            'Beginner': '#6B7280'
        };
        return colors[tier] || colors['Beginner'];
    };

    const tierColor = getTierColor(tier);

    return (
        <div className="flex flex-col items-center gap-4">
            <ProgressRing
                progress={progress}
                size={140}
                strokeWidth={10}
                color={tierColor}
            >
                <div className="flex flex-col items-center">
                    <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        Level
                    </span>
                    <span className="text-4xl font-bold" style={{ color: tierColor }}>
                        {level}
                    </span>
                </div>
            </ProgressRing>

            <div className="text-center">
                <div
                    className="text-lg font-bold mb-1"
                    style={{ color: tierColor }}
                >
                    {tier}
                </div>
                <div className="text-sm text-text-tertiary-light dark:text-text-tertiary-dark">
                    {totalXP.toLocaleString()} XP
                </div>
            </div>
        </div>
    );
}
