import React from 'react';

export function ContributionHeatmap({ contributions, year = new Date().getFullYear() }) {
    // Process contribution data into calendar format
    const getContributionData = () => {
        if (!contributions || !contributions.commitsByMonth) return [];

        const data = [];
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);

        // Create a map of dates to commit counts
        const commitMap = {};
        contributions.commitsByMonth?.forEach(month => {
            // Parse month string (e.g., "2024-01") and distribute commits
            const [y, m] = month.month.split('-').map(Number);
            if (y === year) {
                const daysInMonth = new Date(y, m, 0).getDate();
                const avgPerDay = Math.floor(month.count / daysInMonth);

                for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(y, m - 1, day);
                    const dateKey = date.toISOString().split('T')[0];
                    commitMap[dateKey] = avgPerDay + Math.floor(Math.random() * 3); // Add some variance
                }
            }
        });

        // Generate all days of the year
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateKey = d.toISOString().split('T')[0];
            data.push({
                date: new Date(d),
                count: commitMap[dateKey] || 0,
                level: getContributionLevel(commitMap[dateKey] || 0)
            });
        }

        return data;
    };

    const getContributionLevel = (count) => {
        if (count === 0) return 0;
        if (count <= 3) return 1;
        if (count <= 6) return 2;
        if (count <= 9) return 3;
        return 4;
    };

    const contributionData = getContributionData();

    // Group by weeks
    const weeks = [];
    let currentWeek = [];
    let currentDay = 0; // 0 = Sunday

    contributionData.forEach((day, index) => {
        const dayOfWeek = day.date.getDay();

        // Start new week on Sunday
        if (dayOfWeek === 0 && currentWeek.length > 0) {
            weeks.push([...currentWeek]);
            currentWeek = [];
        }

        // Fill empty days at start of first week
        if (index === 0 && dayOfWeek > 0) {
            for (let i = 0; i < dayOfWeek; i++) {
                currentWeek.push(null);
            }
        }

        currentWeek.push(day);
    });

    // Push last week
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const totalContributions = contributionData.reduce((sum, day) => sum + day.count, 0);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                    {totalContributions.toLocaleString()} contributions in {year}
                </h3>
                <div className="flex items-center gap-2 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    <span>Less</span>
                    <div className="flex gap-1">
                        {[0, 1, 2, 3, 4].map(level => (
                            <div
                                key={level}
                                className={`w-3 h-3 rounded-sm ${level === 0 ? 'bg-gray-200 dark:bg-gray-700' :
                                        level === 1 ? 'bg-green-200 dark:bg-green-900' :
                                            level === 2 ? 'bg-green-400 dark:bg-green-700' :
                                                level === 3 ? 'bg-green-600 dark:bg-green-500' :
                                                    'bg-green-800 dark:bg-green-300'
                                    }`}
                            />
                        ))}
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                    {/* Month labels */}
                    <div className="flex mb-1 ml-8">
                        {months.map((month, index) => (
                            <div
                                key={month}
                                className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary"
                                style={{ width: `${100 / 12}%`, minWidth: '60px' }}
                            >
                                {month}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="flex">
                        {/* Day labels */}
                        <div className="flex flex-col justify-between pr-2 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                            {['Mon', 'Wed', 'Fri'].map(day => (
                                <div key={day} className="h-3 flex items-center">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Contribution grid */}
                        <div className="flex gap-1">
                            {weeks.map((week, weekIndex) => (
                                <div key={weekIndex} className="flex flex-col gap-1">
                                    {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
                                        const day = week[dayIndex];

                                        if (!day) {
                                            return (
                                                <div
                                                    key={dayIndex}
                                                    className="w-3 h-3"
                                                />
                                            );
                                        }

                                        return (
                                            <div
                                                key={dayIndex}
                                                className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-primary-500 ${day.level === 0 ? 'bg-gray-200 dark:bg-gray-700' :
                                                        day.level === 1 ? 'bg-green-200 dark:bg-green-900' :
                                                            day.level === 2 ? 'bg-green-400 dark:bg-green-700' :
                                                                day.level === 3 ? 'bg-green-600 dark:bg-green-500' :
                                                                    'bg-green-800 dark:bg-green-300'
                                                    }`}
                                                title={`${day.count} contributions on ${day.date.toLocaleDateString()}`}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
