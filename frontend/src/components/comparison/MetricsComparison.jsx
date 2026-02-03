import React from 'react';

export function MetricsComparison({ metrics }) {
    const MetricBar = ({ label, metricKey, maxVal = 100 }) => {
        const metric = metrics[metricKey];
        if (!metric) return null;

        const valA = metric.userA;
        const valB = metric.userB;

        // Calculate percentages relative to max value or highest of the two
        const max = Math.max(maxVal, valA, valB);
        const pctA = Math.min(100, Math.round((valA / max) * 100));
        const pctB = Math.min(100, Math.round((valB / max) * 100));

        const isWinnerA = metric.winner === 'A';
        const isWinnerB = metric.winner === 'B';

        return (
            <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                    <span className={`font-bold ${isWinnerA ? 'text-primary-600 dark:text-primary-400' : 'text-light-text-secondary dark:text-dark-text-secondary'}`}>
                        {valA.toLocaleString()}
                    </span>
                    <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                        {label}
                    </span>
                    <span className={`font-bold ${isWinnerB ? 'text-purple-600 dark:text-purple-400' : 'text-light-text-secondary dark:text-dark-text-secondary'}`}>
                        {valB.toLocaleString()}
                    </span>
                </div>

                <div className="flex items-center gap-1 h-3">
                    {/* User A Bar (Right Aligned) */}
                    <div className="flex-1 flex justify-end bg-gray-100 dark:bg-gray-800 rounded-l overflow-hidden h-full">
                        <div
                            className={`h-full rounded-r ${isWinnerA ? 'bg-primary-500' : 'bg-primary-300 dark:bg-primary-700'}`}
                            style={{ width: `${pctA}%` }}
                        />
                    </div>

                    {/* Center Divider */}
                    <div className="w-px h-4 bg-light-border dark:bg-dark-border" />

                    {/* User B Bar (Left Aligned) */}
                    <div className="flex-1 flex justify-start bg-gray-100 dark:bg-gray-800 rounded-r overflow-hidden h-full">
                        <div
                            className={`h-full rounded-l ${isWinnerB ? 'bg-purple-500' : 'bg-purple-300 dark:bg-purple-700'}`}
                            style={{ width: `${pctB}%` }}
                        />
                    </div>
                </div>

                {metric.difference > 0 && (
                    <div className="text-center mt-1">
                        <span className="text-[10px] uppercase font-bold text-light-text-tertiary dark:text-dark-text-tertiary">
                            {metric.winner === 'A' ? 'User A' : 'User B'} +{metric.difference.toLocaleString()}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary mb-6 text-center">
                    Core Metrics
                </h3>
                <MetricBar label="Dev Score" metricKey="devScore" />
                <MetricBar label="Consistency" metricKey="consistencyScore" />
                <MetricBar label="Impact" metricKey="impactScore" />
                <MetricBar label="Doc Quality" metricKey="avgDocQuality" />
            </div>

            <div>
                <h3 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary mb-6 text-center">
                    Activity & Output
                </h3>
                <MetricBar label="Total Commits" metricKey="totalCommits" maxVal={500} />
                <MetricBar label="Active Projects" metricKey="activeProjects" maxVal={5} />
                <MetricBar label="Current Streak" metricKey="currentStreak" maxVal={14} />
                <MetricBar label="Stars Earned" metricKey="totalStars" maxVal={10} />
            </div>
        </div>
    );
}
