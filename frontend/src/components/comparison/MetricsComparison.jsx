import React from 'react';
import { Trophy } from 'lucide-react';

export function MetricsComparison({ metrics }) {
    const MetricRow = ({ label, metricKey, maxVal = 100 }) => {
        const metric = metrics[metricKey];
        if (!metric) return null;

        const valA = metric.userA;
        const valB = metric.userB;

        // Calculate percentages
        const max = Math.max(maxVal, valA, valB) || 1;
        const pctA = Math.min(100, Math.round((valA / max) * 100));
        const pctB = Math.min(100, Math.round((valB / max) * 100));

        const isWinnerA = metric.winner === 'A';
        const isWinnerB = metric.winner === 'B';

        return (
            <div className="mb-6 last:mb-0">
                <div className="flex justify-between items-end mb-2">
                    {/* User A Value */}
                    <div className={`flex items-center gap-2 ${isWinnerA ? 'text-primary-600 dark:text-primary-400 font-bold' : 'text-light-text-secondary dark:text-dark-text-secondary'}`}>
                        {isWinnerA && <Trophy className="w-4 h-4" />}
                        <span className="text-lg">{valA.toLocaleString()}</span>
                    </div>

                    {/* Label */}
                    <span className="text-sm font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wider mb-1">
                        {label}
                    </span>

                    {/* User B Value */}
                    <div className={`flex items-center gap-2 ${isWinnerB ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-light-text-secondary dark:text-dark-text-secondary'}`}>
                        <span className="text-lg">{valB.toLocaleString()}</span>
                        {isWinnerB && <Trophy className="w-4 h-4" />}
                    </div>
                </div>

                <div className="flex items-center gap-4 h-3">
                    {/* User A Bar (Right Aligned) */}
                    <div className="flex-1 flex justify-end h-full bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${isWinnerA ? 'bg-primary-500' : 'bg-primary-300/50 dark:bg-primary-700/50'}`}
                            style={{ width: `${pctA}%`, minWidth: pctA > 0 ? '4px' : '0' }}
                        />
                    </div>

                    {/* Divider Icon or Spacer */}
                    <div className="w-1 h-1 rounded-full bg-light-border dark:bg-dark-border" />

                    {/* User B Bar (Left Aligned) */}
                    <div className="flex-1 flex justify-start h-full bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${isWinnerB ? 'bg-purple-500' : 'bg-purple-300/50 dark:bg-purple-700/50'}`}
                            style={{ width: `${pctB}%`, minWidth: pctB > 0 ? '4px' : '0' }}
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-light-border dark:border-dark-border">
                <h3 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
                    Head-to-Head Metrics
                </h3>
                <div className="flex gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary-500"></div> User A
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div> User B
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <h4 className="text-sm font-bold text-light-text-primary dark:text-dark-text-primary mb-6 bg-light-bg-secondary dark:bg-dark-bg-secondary p-2 rounded text-center">
                        Core Performance
                    </h4>
                    <MetricRow label="Dev Score" metricKey="devScore" />
                    <MetricRow label="Consistency" metricKey="consistencyScore" />
                    <MetricRow label="Impact" metricKey="impactScore" />
                    <MetricRow label="Doc Quality" metricKey="avgDocQuality" />
                </div>

                <div>
                    <h4 className="text-sm font-bold text-light-text-primary dark:text-dark-text-primary mb-6 bg-light-bg-secondary dark:bg-dark-bg-secondary p-2 rounded text-center">
                        Activity & Output
                    </h4>
                    <MetricRow label="Total Commits" metricKey="totalCommits" maxVal={500} />
                    <MetricRow label="Active Projects" metricKey="activeProjects" maxVal={5} />
                    <MetricRow label="Current Streak" metricKey="currentStreak" maxVal={14} />
                    <MetricRow label="Stars Earned" metricKey="totalStars" maxVal={5} />
                </div>
            </div>
        </div>
    );
}
