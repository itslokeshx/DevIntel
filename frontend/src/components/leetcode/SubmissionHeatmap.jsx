import React from 'react';

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

        if (dayOfWeek === 0 && currentWeek.length > 0) {
            weeks.push([...currentWeek]);
            currentWeek = [];
        }

        if (index === 0 && dayOfWeek > 0) {
            for (let i = 0; i < dayOfWeek; i++) {
                currentWeek.push(null);
            }
        }

        currentWeek.push(day);
    });
    if (currentWeek.length > 0) weeks.push(currentWeek);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 sm:p-7">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    Submission Calendar
                </h3>
                <span className="text-[11px] text-[var(--text-tertiary)]">
                    {totalSubmissions} submissions in {year}
                </span>
            </div>

            <div className="overflow-x-auto pb-2">
                <div className="inline-block min-w-full">
                    {/* Month labels */}
                    <div className="flex mb-2 ml-8">
                        {months.map(m => (
                            <div key={m} className="flex-1 text-[10px] text-[var(--text-tertiary)]">
                                {m}
                            </div>
                        ))}
                    </div>

                    <div className="flex">
                        {/* Day labels (Mon, Wed, Fri) */}
                        <div className="flex flex-col justify-between pr-2 text-[10px] text-[var(--text-tertiary)] py-1">
                            <div className="h-2"></div>
                            <div>Mon</div>
                            <div>Wed</div>
                            <div>Fri</div>
                            <div className="h-2"></div>
                        </div>

                        {/* The Grid */}
                        <div className="flex gap-[3px]">
                            {weeks.map((week, wIndex) => (
                                <div key={wIndex} className="flex flex-col gap-[3px]">
                                    {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
                                        const day = week[dayIndex];
                                        if (!day) return <div key={dayIndex} className="w-[10px] h-[10px] sm:w-[13px] sm:h-[13px]" />;

                                        return (
                                            <div
                                                key={dayIndex}
                                                className={`w-[10px] h-[10px] sm:w-[13px] sm:h-[13px] rounded-[2px] cursor-pointer group relative ${
                                                    day.level === 0 ? 'bg-[var(--bg-tertiary)]' :
                                                    day.level === 1 ? 'bg-orange-500/20' :
                                                    day.level === 2 ? 'bg-orange-500/40' :
                                                    day.level === 3 ? 'bg-orange-500/70' :
                                                    'bg-orange-500'
                                                }`}
                                            >
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--text-primary)] text-[var(--bg-primary)] text-[10px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
                                                    <span className="font-semibold">{day.count}</span> submission{day.count !== 1 ? 's' : ''} on {day.date.toLocaleDateString()}
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[var(--text-primary)]" />
                                                </div>
                                            </div>
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
