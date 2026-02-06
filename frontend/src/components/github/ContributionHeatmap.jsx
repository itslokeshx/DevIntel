import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  format,
  startOfYear,
  eachDayOfInterval,
  getDay,
  subWeeks,
  getMonth,
  startOfWeek,
  endOfWeek,
  addDays,
} from "date-fns";

export function ContributionHeatmap({ contributions }) {
  // Use real calendar data if available
  const calendarDays = contributions?.calendar || [];

  // Generate last 52 weeks (365 days) of data - from last February to current date
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

  // Calculate which months to show based on actual data range
  const monthLabels = useMemo(() => {
    const labels = [];
    const monthsSet = new Set();

    weeks.forEach((week, weekIdx) => {
      week.forEach((day) => {
        if (day.date) {
          const monthNum = getMonth(new Date(day.date));
          monthsSet.add(monthNum);
        }
      });
    });

    // Get month abbreviations in order from the start date
    const monthNames = [
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
    ];
    const startMonth = getMonth(startDate);

    for (let i = 0; i < 12; i++) {
      const monthIndex = (startMonth + i) % 12;
      labels.push(monthNames[monthIndex]);
    }

    return labels;
  }, [weeks, startDate]);

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
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-900/50 rounded-[24px] border border-gray-200 dark:border-gray-800 p-8 md:p-10 shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-heading-lg font-bold text-gray-900 dark:text-white">
          📊 Contribution Activity
        </h3>
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {format(startDate, "MMM yyyy")} - {format(today, "MMM yyyy")}
        </div>
      </div>

      {/* Month labels - accurately showing last 12 months */}
      <div className="flex gap-1 mb-3 text-xs font-medium text-gray-600 dark:text-gray-400">
        {monthLabels.map((m, idx) => (
          <div key={`${m}-${idx}`} className="w-[calc(100%/12)] text-center">
            {m}
          </div>
        ))}
      </div>

      {/* Heatmap grid - Premium enhanced with smooth rendering */}
      <div className="flex gap-[3px] mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {weeks.map((week, weekIdx) => (
          <motion.div
            key={weekIdx}
            className="flex flex-col gap-[3px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: weekIdx * 0.01, duration: 0.3 }}
          >
            {week.map((day, dayIdx) => {
              if (!day.date)
                return <div key={dayIdx} className="w-[14px] h-[14px]" />;

              const formattedDate = format(new Date(day.date), "MMM d, yyyy");
              const dayName = format(new Date(day.date), "EEEE");

              return (
                <motion.div
                  key={`${weekIdx}-${dayIdx}`}
                  whileHover={{ scale: 1.5, zIndex: 10 }}
                  className={`w-[14px] h-[14px] rounded-[3px] ${getColor(day.count)} cursor-pointer transition-all duration-200 relative group`}
                  title={`${formattedDate} (${dayName})\n${day.count} commit${day.count !== 1 ? "s" : ""}`}
                >
                  {/* Premium tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-2xl border border-gray-700 dark:border-gray-300">
                    <div className="font-semibold text-sm">{formattedDate}</div>
                    <div className="text-gray-300 dark:text-gray-600 text-xs mb-1">
                      {dayName}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div
                        className={`w-2 h-2 rounded-sm ${getColor(day.count)}`}
                      />
                      <span className="font-bold text-blue-400 dark:text-blue-600">
                        {day.count}
                      </span>{" "}
                      <span className="text-xs">
                        commit{day.count !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {/* Tooltip arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900 dark:border-t-gray-100" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ))}
      </div>

      {/* Legend - Premium styled */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
          <span>Less</span>
          <div className="flex gap-1.5">
            <div className="w-3.5 h-3.5 heatmap-0 rounded border border-gray-200 dark:border-gray-700" />
            <div className="w-3.5 h-3.5 heatmap-1 rounded" />
            <div className="w-3.5 h-3.5 heatmap-2 rounded" />
            <div className="w-3.5 h-3.5 heatmap-3 rounded" />
            <div className="w-3.5 h-3.5 heatmap-4 rounded" />
          </div>
          <span>More</span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {weeks.flat().filter((d) => d.count > 0).length}
          </span>{" "}
          active days
        </div>
      </div>

      {/* Activity Intensity Timeline - Premium version */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 p-6 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30"
      >
        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <span className="text-lg">📈</span>
          Activity Intensity Over Time
        </h4>
        <div className="h-28 relative bg-white dark:bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm">
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
                {/* Premium gradient definition */}
                <defs>
                  <linearGradient
                    id="activityGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient
                    id="strokeGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
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
                                              (d.commits / maxCommits) * 85;
                                            return `L ${x} ${y}`;
                                          })
                                          .join(" ")}
                                        L ${weeklyData.length * 8} 100
                                        Z
                                    `}
                  fill="url(#activityGradient)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.4 }}
                />

                {/* Line stroke with gradient */}
                <motion.path
                  d={`
                                        M 0 ${100 - (weeklyData[0].commits / maxCommits) * 85}
                                        ${weeklyData
                                          .slice(1)
                                          .map((d, i) => {
                                            const x = (i + 1) * 8;
                                            const y =
                                              100 -
                                              (d.commits / maxCommits) * 85;
                                            return `L ${x} ${y}`;
                                          })
                                          .join(" ")}
                                    `}
                  stroke="url(#strokeGradient)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                />

                {/* Peak marker with glow */}
                {peakWeek && peakWeek.commits > 0 && (
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                  >
                    {/* Glow effect */}
                    <circle
                      cx={peakWeek.week * 8}
                      cy={100 - (peakWeek.commits / maxCommits) * 85}
                      r="6"
                      fill="#f59e0b"
                      opacity="0.3"
                    />
                    <circle
                      cx={peakWeek.week * 8}
                      cy={100 - (peakWeek.commits / maxCommits) * 85}
                      r="4"
                      fill="#f59e0b"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  </motion.g>
                )}
              </svg>
            );
          })()}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mt-3 font-medium">
          <span className="text-gray-500 dark:text-gray-500">
            {format(startDate, "MMM yyyy")}
          </span>
          <span className="flex items-center gap-1.5 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-amber-700 dark:text-amber-400">
              Peak Week
            </span>
          </span>
          <span className="text-gray-500 dark:text-gray-500">
            {format(today, "MMM yyyy")}
          </span>
        </div>
      </motion.div>

      {/* Premium Stats Row with gradient cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-2xl p-6 border border-blue-200 dark:border-blue-800/30"
        >
          <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-blue-600 to-blue-500 bg-clip-text text-transparent">
            {totalCommits.toLocaleString()}
          </div>
          <div className="text-sm font-semibold text-blue-700 dark:text-blue-400 mt-2">
            Total Commits
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-green-50 to-emerald-100/50 dark:from-green-900/20 dark:to-emerald-900/10 rounded-2xl p-6 border border-green-200 dark:border-green-800/30"
        >
          <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-green-600 to-emerald-500 bg-clip-text text-transparent">
            {currentStreak.toLocaleString()}
          </div>
          <div className="text-sm font-semibold text-green-700 dark:text-green-400 mt-2 flex items-center gap-1">
            <span>🔥</span> Current Streak
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-purple-50 to-fuchsia-100/50 dark:from-purple-900/20 dark:to-fuchsia-900/10 rounded-2xl p-6 border border-purple-200 dark:border-purple-800/30"
        >
          <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
            {longestStreak.toLocaleString()}
          </div>
          <div className="text-sm font-semibold text-purple-700 dark:text-purple-400 mt-2 flex items-center gap-1">
            <span>⚡</span> Longest Streak
          </div>
        </motion.div>
      </div>
    </div>
  );
}
