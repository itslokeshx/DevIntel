import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  format,
  eachDayOfInterval,
  getMonth,
  subWeeks,
} from "date-fns";

export function ContributionHeatmap({ contributions }) {
  const calendarDays = contributions?.calendar || [];
  const today = new Date();
  const startDate = subWeeks(today, 52);
  const days = eachDayOfInterval({ start: startDate, end: today });

  const commitMap = new Map();

  if (calendarDays.length > 0) {
    calendarDays.forEach((day) => {
      if (day.date && day.count !== undefined) {
        commitMap.set(day.date, day.count);
      }
    });
  } else if (contributions?.commitsByMonth) {
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
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Contribution Activity
        </h3>
        <span className="text-[11px] text-[var(--text-tertiary)]">
          {format(startDate, "MMM yyyy")} — {format(today, "MMM yyyy")}
        </span>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 pb-2 mb-5">
        <div className="flex gap-[2px] sm:gap-[3px] justify-center min-w-fit">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-[2px] sm:gap-[3px]">
              {week.map((day, dayIdx) => {
                if (!day.date)
                  return (
                    <div
                      key={dayIdx}
                      className="w-[10px] h-[10px] sm:w-[13px] sm:h-[13px]"
                    />
                  );

                return (
                  <div
                    key={`${weekIdx}-${dayIdx}`}
                    className={`w-[10px] h-[10px] sm:w-[13px] sm:h-[13px] rounded-[2px] ${getColor(day.count)} cursor-pointer relative group`}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--text-primary)] text-[var(--bg-primary)] text-[10px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
                      <span className="font-semibold">{day.count}</span> commit
                      {day.count !== 1 ? "s" : ""} ·{" "}
                      {format(new Date(day.date), "MMM d")}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[var(--text-primary)]" />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-tertiary)]">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 heatmap-0 rounded-sm border border-[var(--border-default)]" />
            <div className="w-3 h-3 heatmap-1 rounded-sm" />
            <div className="w-3 h-3 heatmap-2 rounded-sm" />
            <div className="w-3 h-3 heatmap-3 rounded-sm" />
            <div className="w-3 h-3 heatmap-4 rounded-sm" />
          </div>
          <span>More</span>
        </div>
        <span className="text-[10px] text-[var(--text-tertiary)]">
          <strong className="text-[var(--text-secondary)]">
            {weeks.flat().filter((d) => d.count > 0).length}
          </strong>{" "}
          active days
        </span>
      </div>

      {/* Activity chart */}
      <div className="mb-6 p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-subtle)]">
        <h4 className="text-[11px] font-medium text-[var(--text-tertiary)] mb-3 uppercase tracking-wider">
          Activity Over Time
        </h4>
        <div className="h-20 relative">
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

            return (
              <svg
                className="w-full h-full"
                viewBox={`0 0 ${weeklyData.length * 8} 100`}
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="actFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                <motion.path
                  d={`
                    M 0 100
                    ${weeklyData.map((d, i) => {
                      const x = i * 8;
                      const y = 100 - (d.commits / maxCommits) * 85;
                      return `L ${x} ${y}`;
                    }).join(" ")}
                    L ${weeklyData.length * 8} 100 Z
                  `}
                  fill="url(#actFill)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                />

                <motion.path
                  d={`
                    M 0 ${100 - (weeklyData[0].commits / maxCommits) * 85}
                    ${weeklyData.slice(1).map((d, i) => {
                      const x = (i + 1) * 8;
                      const y = 100 - (d.commits / maxCommits) * 85;
                      return `L ${x} ${y}`;
                    }).join(" ")}
                  `}
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity="0.6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </svg>
            );
          })()}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)]">
            {totalCommits.toLocaleString()}
          </div>
          <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5">
            Total Commits
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)]">
            {currentStreak}
          </div>
          <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5">
            Current Streak
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)]">
            {longestStreak}
          </div>
          <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5">
            Longest Streak
          </div>
        </div>
      </div>
    </div>
  );
}
