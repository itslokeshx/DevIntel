import React from 'react';
import { LevelBadge } from './LevelBadge';
import { AchievementGrid } from './AchievementGrid';
import { Trophy, Zap, Target, TrendingUp } from 'lucide-react';

/**
 * Gamification dashboard showing level, achievements, and stats
 */
export function GamificationDashboard({ gamification }) {
    if (!gamification) return null;

    const { level, achievements, stats, percentiles } = gamification;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    Developer Profile
                </h2>
            </div>

            {/* Level and Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Level Badge */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    <LevelBadge
                        level={level.level}
                        tier={level.tier}
                        progress={level.progressToNext}
                        totalXP={level.totalXP}
                    />
                </div>

                {/* XP Breakdown */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        XP Breakdown
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {Object.entries(level.xpBreakdown).map(([source, xp]) => (
                            <div key={source} className="text-center">
                                <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                                    {xp.toLocaleString()}
                                </div>
                                <div className="text-xs text-text-tertiary-light dark:text-text-tertiary-dark capitalize">
                                    {source.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Progress to next level */}
                    <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-text-secondary-light dark:text-text-secondary-dark">
                                Level {level.level}
                            </span>
                            <span className="text-text-secondary-light dark:text-text-secondary-dark">
                                Level {level.level + 1}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${level.progressToNext}%` }}
                            />
                        </div>
                        <div className="text-center mt-2 text-sm text-text-tertiary-light dark:text-text-tertiary-dark">
                            {(level.nextLevelXP - level.currentLevelXP - (level.totalXP - level.currentLevelXP)).toLocaleString()} XP to next level
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Achievements ({achievements.length})
                </h3>
                <AchievementGrid achievements={achievements} />
            </div>

            {/* Percentile Rankings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Percentile Rankings
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Object.entries(percentiles).map(([metric, percentile]) => (
                        <div key={metric} className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <div className="text-3xl font-bold text-green-500 dark:text-green-400">
                                {percentile}%
                            </div>
                            <div className="text-xs text-text-tertiary-light dark:text-text-tertiary-dark capitalize mt-1">
                                {metric}
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-text-tertiary-light dark:text-text-tertiary-dark mt-4 text-center">
                    Compared to average GitHub developers
                </p>
            </div>
        </div>
    );
}
