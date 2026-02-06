import React from "react";
import { motion } from "framer-motion";
import {
  format,
  startOfYear,
  eachDayOfInterval,
  getDay,
  subWeeks,
} from "date-fns";

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
    calendarDays.forEach((day) => {
      if (day.date && day.count !== undefined) {
        commitMap.set(day.date, day.count);
      }
    });
  } else if (contributions?.commitsByMonth) {
    // Fallback: distribute commits across months
    contributions.commitsByMonth.forEach(({ month, count }) => {
      const [year, monthNum] = month.split("-").map(Number);
      const daysInMonth = new Date(year, monthNum, 0).getDate();
      const commitsPerDay = Math.round(count / daysInMonth);

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, monthNum - 1, day);
        const dateStr = format(date, "yyyy-MM-dd");
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
        const dateStr = format(day, "yyyy-MM-dd");
        const count = commitMap.get(dateStr) || 0;
        week.push({ date: dateStr, count });
      } else {
        week.push({ date: null, count: 0 });
      }
    }
    weeks.push(week);
  }

  const getColor = (count) => {
    if (count === 0) return "heatmap-0";
    if (count < 3) return "heatmap-1";
    if (count < 6) return "heatmap-2";
    if (count < 10) return "heatmap-3";
    return "heatmap-4";
  };

  const totalCommits = contributions?.totalCommits || 0;
  const currentStreak = contributions?.currentStreak || 0;
  const longestStreak = contributions?.longestStreak || 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[20px] border border-gray-200 dark:border-gray-800 p-10">
      <h3 className="text-heading-lg font-bold text-gray-900 dark:text-white mb-8">
        📊 Contribution Activity
      </h3>

      {/* Month labels */}
      <div className="flex gap-1 mb-2 text-xs text-gray-500 dark:text-gray-400">
        {[
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ].map((m) => (
          <div key={m} className="w-[calc(100%/12)] text-center">
            {m}
          </div>
        ))}
      </div>

      {/* Heatmap grid - ENHANCED with larger cells */}
      <div className="flex gap-[3px] mb-4 overflow-x-auto">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-[3px]">
            {week.map((day, dayIdx) => {
              if (!day.date)
                return <div key={dayIdx} className="w-[14px] h-[14px]" />;

              const formattedDate = format(new Date(day.date), "MMM d, yyyy");
              const dayName = format(new Date(day.date), "EEEE");

              return (
                <motion.div
                  key={`${weekIdx}-${dayIdx}`}
                  whileHover={{ scale: 1.4, zIndex: 10 }}
                  className={`w-[14px] h-[14px] rounded-sm ${getColor(day.count)} cursor-pointer transition-all relative group`}
                  title={`${formattedDate} (${dayName})\n${day.count} commit${day.count !== 1 ? "s" : ""}`}
                >
                  {/* Enhanced tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                    <div className="font-semibold">{formattedDate}</div>
                    <div className="text-gray-300 dark:text-gray-600">
                      {dayName}
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-bold text-blue-400 dark:text-blue-600">
                        {day.count}
                      </span>{" "}
                      commit{day.count !== 1 ? "s" : ""}
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
      <div className="flex items-center justify-end gap-1.5 mb-6 text-xs text-gray-500 dark:text-gray-400">
        <span>Less</span>
        <div className="w-3 h-3 heatmap-0 rounded-sm" />
        <div className="w-3 h-3 heatmap-1 rounded-sm" />
        <div className="w-3 h-3 heatmap-2 rounded-sm" />
        <div className="w-3 h-3 heatmap-3 rounded-sm" />
        <div className="w-3 h-3 heatmap-4 rounded-sm" />
        <span>More</span>
      </div>

      {/* Activity Intensity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          📈 Activity Intensity
        </h4>
        <div className="h-24 relative">
          {/* Calculate weekly aggregates */}
          {(() => {
            const weeklyData = [];
            for (let w = 0; w < Math.min(weeks.length, 52); w++) {
              const weekCommits = weeks[w].reduce(
                (sum, day) => sum + (day.count || 0),
                0,
              );
              weeklyData.push({ week: w, commits: weekCommits });
            }

            const maxCommits = Math.max(...weeklyData.map((d) => d.commits), 1);
            const peakWeek = weeklyData.reduce(
              (max, d) => (d.commits > max.commits ? d : max),
              weeklyData[0],
            );

            return (
              <svg
                className="w-full h-full"
                viewBox={`0 0 ${weeklyData.length * 8} 100`}
                preserveAspectRatio="none"
              >
                {/* Gradient definition */}
                <defs>
                  <linearGradient
                    id="activityGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* Area fill */}
                <motion.path
                  d={`
                                        M 0 100
                                        ${weeklyData
                                          .map((d, i) => {
                                            const x = i * 8;
                                            const y =
                                              100 -
                                              (d.commits / maxCommits) * 80;
                                            return `L ${x} ${y}`;
                                          })
                                          .join(" ")}
                                        L ${weeklyData.length * 8} 100
                                        Z
                                    `}
                  fill="url(#activityGradient)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                />

                {/* Line stroke */}
                <motion.path
                  d={`
                                        M 0 ${100 - (weeklyData[0].commits / maxCommits) * 80}
                                        ${weeklyData
                                          .slice(1)
                                          .map((d, i) => {
                                            const x = (i + 1) * 8;
                                            const y =
                                              100 -
                                              (d.commits / maxCommits) * 80;
                                            return `L ${x} ${y}`;
                                          })
                                          .join(" ")}
                                    `}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
                />

                {/* Peak marker */}
                {peakWeek && peakWeek.commits > 0 && (
                  <motion.g
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                  >
                    <circle
                      cx={peakWeek.week * 8}
                      cy={100 - (peakWeek.commits / maxCommits) * 80}
                      r="3"
                      fill="#f59e0b"
                      stroke="#fff"
                      strokeWidth="1"
                    />
                  </motion.g>
                )}
              </svg>
            );
          })()}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>52 weeks ago</span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            Peak week
          </span>
          <span>Today</span>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <div className="text-4xl font-extrabold text-blue-500">
            {totalCommits}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Total commits
          </div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-extrabold text-green-500">
            {currentStreak}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Current streak
          </div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-extrabold text-purple-500">
            {longestStreak}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Longest streak
          </div>
        </div>
      </div>
    </div>
  );
}
