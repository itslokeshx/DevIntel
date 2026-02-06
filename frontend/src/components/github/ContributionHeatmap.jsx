import React from 'react';
import { motion } from 'framer-motion';
import { format, startOfYear, eachDayOfInterval, getDay, subWeeks } from 'date-fns';

export function ContributionHeatmap({ contributions }) {
    // Use real calendar data if available
    const calendarDays = contributions?.calendar || [];

    // Generate last 52 weeks of data
    const today = new Date();
    const startDate = subWeeks(today, 52);
    const days = eachDayOfInterval({ start: startDate, end: today });

    // Create a map of dates to commit counts
    const commitMap = new Map();

    if (calendarDays.length > 0) {
        // Use 100% real calendar data from GitHub GraphQL API
        calendarDays.forEach(day => {
            if (day.date && day.count !== undefined) {
                commitMap.set(day.date, day.count);
            }
        });
    } else if (contributions?.commitsByMonth) {
        // Fallback: distribute commits across months
        contributions.commitsByMonth.forEach(({ month, count }) => {
            const [year, monthNum] = month.split('-').map(Number);
            const daysInMonth = new Date(year, monthNum, 0).getDate();
            const commitsPerDay = Math.round(count / daysInMonth);

            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, monthNum - 1, day);
                const dateStr = format(date, 'yyyy-MM-dd');
                commitMap.set(dateStr, commitsPerDay);
            }
        });
    }

    // Organize into weeks (7 days per week, 52 weeks)
    const weeks = [];
    for (let w = 0; w < 52; w++) {
        const week = [];
        for (let d = 0; d < 7; d++) {
            const dayIndex = w * 7 + d;
            if (dayIndex < days.length) {
                const day = days[dayIndex];
                const dateStr = format(day, 'yyyy-MM-dd');
                const count = commitMap.get(dateStr) || 0;
                week.push({ date: dateStr, count });
            } else {
                week.push({ date: null, count: 0 });
            }
        }
        weeks.push(week);
    }

    const getColor = (count) => {
        if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
        if (count < 3) return 'bg-blue-200 dark:bg-blue-900';
        if (count < 6) return 'bg-blue-400 dark:bg-blue-700';
        if (count < 10) return 'bg-blue-600 dark:bg-blue-500';
        return 'bg-blue-800 dark:bg-blue-300';
    };

    const totalCommits = contributions?.totalCommits || 0;
    const currentStreak = contributions?.currentStreak || 0;
    const longestStreak = contributions?.longestStreak || 0;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">📊 Contribution Timeline</h3>

            {/* Month labels */}
            <div className="flex gap-1 mb-2 text-xs text-gray-500 dark:text-gray-400">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                    <div key={m} className="w-[calc(100%/12)] text-center">{m}</div>
                ))}
            </div>

            {/* Heatmap grid - ENHANCED with larger cells */}
            <div className="flex gap-[3px] mb-4 overflow-x-auto">
                {weeks.map((week, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col gap-[3px]">
                        {week.map((day, dayIdx) => {
                            if (!day.date) return <div key={dayIdx} className="w-[14px] h-[14px]" />;

                            const formattedDate = format(new Date(day.date), 'MMM d, yyyy');
                            const dayName = format(new Date(day.date), 'EEEE');

                            return (
                                <motion.div
                                    key={`${weekIdx}-${dayIdx}`}
                                    whileHover={{ scale: 1.4, zIndex: 10 }}
                                    className={`w-[14px] h-[14px] rounded-sm ${getColor(day.count)} cursor-pointer transition-all relative group`}
                                    title={`${formattedDate} (${dayName})\n${day.count} commit${day.count !== 1 ? 's' : ''}`}
                                >
                                    {/* Enhanced tooltip on hover */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                                        <div className="font-semibold">{formattedDate}</div>
                                        <div className="text-gray-300 dark:text-gray-600">{dayName}</div>
                                        <div className="mt-1 text-sm">
                                            <span className="font-bold text-blue-400 dark:text-blue-600">{day.count}</span> commit{day.count !== 1 ? 's' : ''}
                                        </div>
                                        {/* Tooltip arrow */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Legend - ENHANCED */}
            <div className="flex items-center gap-2 mb-6 text-xs text-gray-600 dark:text-gray-400">
                <span>Less</span>
                <div className="w-[14px] h-[14px] bg-gray-100 dark:bg-gray-800 rounded-sm" />
                <div className="w-[14px] h-[14px] bg-blue-200 dark:bg-blue-900 rounded-sm" />
                <div className="w-[14px] h-[14px] bg-blue-400 dark:bg-blue-700 rounded-sm" />
                <div className="w-[14px] h-[14px] bg-blue-600 dark:bg-blue-500 rounded-sm" />
                <div className="w-[14px] h-[14px] bg-blue-800 dark:bg-blue-300 rounded-sm" />
                <span>More</span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                <div>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalCommits}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Commits ({new Date().getFullYear() === 2026 ? '2025' : new Date().getFullYear()})</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">{currentStreak}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Current Streak</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{longestStreak}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Longest Streak</div>
                </div>
            </div>
        </div>
    );
}
