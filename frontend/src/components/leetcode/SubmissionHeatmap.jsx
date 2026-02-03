import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Card } from '../common/Card';

export function SubmissionHeatmap({ calendar }) {
    if (!calendar) return null;

    // Calendar is { "1678233600": 5, ... } (unix timestamp seconds -> count)
    const year = new Date().getFullYear();
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Process data
    const data = [];
    const timestamps = Object.keys(calendar).map(Number);
    const totalSubmissions = Object.values(calendar).reduce((a, b) => a + b, 0);

    // Create a map of date strings to counts
    const countMap = {};
    timestamps.forEach(ts => {
        const date = new Date(ts * 1000);
        const dateKey = date.toISOString().split('T')[0];
        countMap[dateKey] = calendar[ts];
    });

    // Determine max for scaling color intesity
    // LeetCode actually just uses simple thresholds usually
    const getLevel = (count) => {
        if (!count) return 0;
        if (count <= 2) return 1;
        if (count <= 5) return 2;
        if (count <= 9) return 3;
        return 4;
    };

    // Generate days for the year
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString().split('T')[0];
        const count = countMap[dateKey] || 0;
        data.push({
            date: new Date(d),
            count,
            level: getLevel(count)
        });
    }

    // Group by weeks
    const weeks = [];
    let currentWeek = [];

    data.forEach((day, index) => {
        const dayOfWeek = day.date.getDay(); // 0 = Sun

        // If Sunday and we have a current week (and it's not empty), push it
        if (dayOfWeek === 0 && currentWeek.length > 0) {
            weeks.push([...currentWeek]);
            currentWeek = [];
        }

        // Pad first week if needed
        if (index === 0 && dayOfWeek > 0) {
            for (let i = 0; i < dayOfWeek; i++) {
                currentWeek.push(null);
            }
        }

        currentWeek.push(day);
    });
    // Push last week
    if (currentWeek.length > 0) weeks.push(currentWeek);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary">
                    Submission Calendar
                </h3>
                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {totalSubmissions} submissions in {year}
                </span>
            </div>

            <div className="overflow-x-auto pb-2">
                <div className="inline-block min-w-full">
                    {/* Month labels */}
                    <div className="flex mb-2 ml-8">
                        {months.map(m => (
                            <div key={m} className="flex-1 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                {m}
                            </div>
                        ))}
                    </div>

                    <div className="flex">
                        {/* Day labels (Mon, Wed, Fri) */}
                        <div className="flex flex-col justify-between pr-2 text-xs text-light-text-tertiary dark:text-dark-text-tertiary py-1">
                            <div className="h-2"></div>
                            <div>Mon</div>
                            <div>Wed</div>
                            <div>Fri</div>
                            <div className="h-2"></div>
                        </div>

                        {/* The Grid */}
                        <div className="flex gap-1">
                            {weeks.map((week, wIndex) => (
                                <div key={wIndex} className="flex flex-col gap-1">
                                    {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
                                        const day = week[dayIndex];
                                        if (!day) return <div key={dayIndex} className="w-3 h-3" />;

                                        return (
                                            <div
                                                key={dayIndex}
                                                className={`w-3 h-3 rounded-sm ${day.level === 0 ? 'bg-gray-100 dark:bg-gray-800' :
                                                        day.level === 1 ? 'bg-orange-200 dark:bg-orange-900/40' :
                                                            day.level === 2 ? 'bg-orange-300 dark:bg-orange-700' :
                                                                day.level === 3 ? 'bg-orange-500 dark:bg-orange-600' :
                                                                    'bg-orange-600 dark:bg-orange-500'
                                                    }`}
                                                title={`${day.count} submissions on ${day.date.toLocaleDateString()}`}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
