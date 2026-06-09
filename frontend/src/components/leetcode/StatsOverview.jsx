import React from 'react';
import { Trophy, Target, Globe } from 'lucide-react';

export function StatsOverview({ profile, stats, badges }) {
    if (!profile || !stats) return null;

    const easyPct = (stats.easySolved / stats.easyTotal) * 100;
    const mediumPct = (stats.mediumSolved / stats.mediumTotal) * 100;
    const hardPct = (stats.hardSolved / stats.hardTotal) * 100;

    return (
        <div className="space-y-4">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 sm:p-5">
                    <div className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] mb-1">
                        #{stats.ranking?.toLocaleString() || profile.ranking?.toLocaleString()}
                    </div>
                    <div className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                        Global Rank
                    </div>
                    <div className="text-[10px] text-[var(--text-tertiary)]">
                        Top {stats.topPercentage || '5%'} estimated
                    </div>
                </div>

                <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 sm:p-5">
                    <div className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] mb-1">
                        {stats.totalSolved.toLocaleString()}
                    </div>
                    <div className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                        Total Solved
                    </div>
                    <div className="text-[10px] text-[var(--text-tertiary)]">
                        {stats.acceptanceRate}% acceptance rate
                    </div>
                </div>

                <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 sm:p-5">
                    <div className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] mb-1">
                        {profile.reputation?.toLocaleString() || 0}
                    </div>
                    <div className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                        Reputation
                    </div>
                    <div className="text-[10px] text-[var(--text-tertiary)]">
                        {badges.length} badges earned
                    </div>
                </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 sm:p-7">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-5">
                    Problem Solving Progress
                </h3>

                <div className="space-y-4">
                    {/* Easy */}
                    <div>
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-green-600 dark:text-green-400 font-medium">Easy</span>
                            <span className="text-[var(--text-tertiary)]">
                                <span className="font-semibold text-[var(--text-primary)]">{stats.easySolved}</span>
                                <span className="mx-1">/</span>
                                {stats.easyTotal}
                            </span>
                        </div>
                        <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                          <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${easyPct}%`, opacity: 0.8 }}
                          />
                        </div>
                    </div>

                    {/* Medium */}
                    <div>
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-yellow-600 dark:text-yellow-400 font-medium">Medium</span>
                            <span className="text-[var(--text-tertiary)]">
                                <span className="font-semibold text-[var(--text-primary)]">{stats.mediumSolved}</span>
                                <span className="mx-1">/</span>
                                {stats.mediumTotal}
                            </span>
                        </div>
                        <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-500 rounded-full"
                                style={{ width: `${mediumPct}%`, opacity: 0.8 }}
                            />
                        </div>
                    </div>

                    {/* Hard */}
                    <div>
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-red-600 dark:text-red-400 font-medium">Hard</span>
                            <span className="text-[var(--text-tertiary)]">
                                <span className="font-semibold text-[var(--text-primary)]">{stats.hardSolved}</span>
                                <span className="mx-1">/</span>
                                {stats.hardTotal}
                            </span>
                        </div>
                        <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-red-500 rounded-full"
                                style={{ width: `${hardPct}%`, opacity: 0.8 }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Badges */}
            {badges.length > 0 && (
                <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 sm:p-7">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-5">
                        Badges ({badges.length})
                    </h3>
                    <div className="flex flex-wrap gap-3.5">
                        {badges.map((badge, index) => (
                            <div key={index} className="flex flex-col items-center group relative cursor-pointer">
                                <img
                                    src={badge.icon}
                                    alt={badge.name}
                                    className="w-10 h-10 object-contain hover:scale-105 transition-transform"
                                />
                                <span className="absolute bottom-full mb-2 bg-[var(--text-primary)] text-[var(--bg-primary)] text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
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
