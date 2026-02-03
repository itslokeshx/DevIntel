import React from 'react';
import { Trophy, Target, Globe } from 'lucide-react';
import StatsCard from '../common/StatsCard';

export function StatsOverview({ profile, stats, badges }) {
    if (!profile || !stats) return null;

    return (
        <div className="space-y-6">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatsCard
                    title="Global Rank"
                    value={`#${stats.ranking?.toLocaleString() || profile.ranking.toLocaleString()}`}
                    icon={<Globe className="w-6 h-6 text-blue-500" />}
                    trend={`Top ${stats.topPercentage || '5%'} estimated`}
                    color="blue"
                />
                <StatsCard
                    title="Total Solved"
                    value={stats.totalSolved.toLocaleString()}
                    icon={<Target className="w-6 h-6 text-green-500" />}
                    trend={`${stats.acceptanceRate}% Acceptance`}
                    color="green"
                />
                <StatsCard
                    title="Reputation"
                    value={profile.reputation?.toLocaleString() || 0}
                    icon={<Trophy className="w-6 h-6 text-yellow-500" />}
                    trend={`${badges.length} Badges Earned`}
                    color="yellow"
                />
            </div>

            {/* Difficulty Breakdown */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm border border-light-border dark:border-dark-border p-6">
                <h3 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
                    Problem Solving Progress
                </h3>

                <div className="space-y-4">
                    {/* Easy */}
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-green-600 dark:text-green-400 font-medium">Easy</span>
                            <span className="text-light-text-tertiary dark:text-dark-text-tertiary">
                                <span className="font-bold text-light-text-primary dark:text-dark-text-primary">{stats.easySolved}</span>
                                / {stats.easyTotal}
                            </span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${(stats.easySolved / stats.easyTotal) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Medium */}
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-yellow-600 dark:text-yellow-400 font-medium">Medium</span>
                            <span className="text-light-text-tertiary dark:text-dark-text-tertiary">
                                <span className="font-bold text-light-text-primary dark:text-dark-text-primary">{stats.mediumSolved}</span>
                                / {stats.mediumTotal}
                            </span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-500 rounded-full"
                                style={{ width: `${(stats.mediumSolved / stats.mediumTotal) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Hard */}
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-red-600 dark:text-red-400 font-medium">Hard</span>
                            <span className="text-light-text-tertiary dark:text-dark-text-tertiary">
                                <span className="font-bold text-light-text-primary dark:text-dark-text-primary">{stats.hardSolved}</span>
                                / {stats.hardTotal}
                            </span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-red-500 rounded-full"
                                style={{ width: `${(stats.hardSolved / stats.hardTotal) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Badges */}
            {badges.length > 0 && (
                <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm border border-light-border dark:border-dark-border p-6">
                    <h3 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        Badges ({badges.length})
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {badges.map((badge, index) => (
                            <div key={index} className="flex flex-col items-center group relative cursor-pointer">
                                <img
                                    src={badge.icon}
                                    alt={badge.name}
                                    className="w-12 h-12 object-contain filter hover:brightness-110 transition-all"
                                />
                                <span className="absolute -bottom-8 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    {badge.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
