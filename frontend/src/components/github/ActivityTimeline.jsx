import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export function ActivityTimeline({ contributions }) {
    // Process data for last 12 months
    const getTimelineData = () => {
        if (!contributions || !contributions.commitsByMonth) return [];

        const months = [];
        const now = new Date();

        // Get last 12 months
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            const monthData = contributions.commitsByMonth?.find(m => m.month === monthKey);

            months.push({
                month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
                commits: monthData?.count || 0,
                fullDate: date
            });
        }

        return months;
    };

    const timelineData = getTimelineData();
    const totalCommits = timelineData.reduce((sum, month) => sum + month.commits, 0);
    const avgCommits = Math.round(totalCommits / 12);
    const maxCommits = Math.max(...timelineData.map(m => m.commits));
    const busiestMonth = timelineData.find(m => m.commits === maxCommits);

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length) return null;

        return (
            <div className="bg-white dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg shadow-lg p-3">
                <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-1">
                    {payload[0].payload.month}
                </p>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    <span className="font-bold text-primary-500">{payload[0].value}</span> commits
                </p>
            </div>
        );
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                        Activity Timeline
                    </h3>
                    <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                        Last 12 months
                    </p>
                </div>

                <div className="flex gap-6 text-sm">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary-500 dark:text-primary-400">
                            {totalCommits.toLocaleString()}
                        </div>
                        <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                            Total Commits
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-500 dark:text-green-400">
                            {avgCommits}
                        </div>
                        <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                            Avg/Month
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-500 dark:text-orange-400">
                            {maxCommits}
                        </div>
                        <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                            Peak Month
                        </div>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={timelineData}>
                    <defs>
                        <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="month"
                        stroke="#9CA3AF"
                        style={{ fontSize: '12px' }}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="#9CA3AF"
                        style={{ fontSize: '12px' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="commits"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        fill="url(#commitGradient)"
                        dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                    />
                </AreaChart>
            </ResponsiveContainer>

            {busiestMonth && (
                <div className="mt-4 p-3 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-lg border border-light-border dark:border-dark-border">
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                            Busiest Month:
                        </span>{' '}
                        {busiestMonth.month} with {busiestMonth.commits} commits
                        {busiestMonth.commits > avgCommits * 2 && (
                            <span className="ml-2 text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">
                                🔥 2x above average
                            </span>
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}
