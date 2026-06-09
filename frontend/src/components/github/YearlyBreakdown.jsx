import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export function YearlyBreakdown({ yearlyBreakdown, contributions }) {
  const currentYear = new Date().getFullYear();
  const validYears = useMemo(
    () =>
      yearlyBreakdown
        ?.filter((y) => y.year >= 2020 && y.year <= currentYear)
        .sort((a, b) => b.year - a.year) || [],
    [yearlyBreakdown, currentYear],
  );
  const [selectedYear, setSelectedYear] = useState(
    validYears?.[0]?.year || currentYear,
  );

  if (!validYears || validYears.length === 0) {
    return null;
  }

  // "All Time" aggregation
  const allTimeData = useMemo(() => {
    const totals = validYears.reduce(
      (acc, y) => ({
        year: "all",
        repos: acc.repos + y.repos,
        commits: acc.commits + y.commits,
        stars: acc.stars + y.stars,
        streak: Math.max(acc.streak, y.streak),
        topLanguage: null,
        monthlyCommits: [],
      }),
      { repos: 0, commits: 0, stars: 0, streak: 0 },
    );
    return totals;
  }, [validYears]);

  const currentYearData =
    selectedYear === "all"
      ? allTimeData
      : validYears.find((y) => y.year === selectedYear) || validYears[0];

  const monthlyCommits = useMemo(() => {
    if (selectedYear === "all") return [];
    return (
      contributions?.commitsByMonth
        ?.filter(({ month }) => month.startsWith(selectedYear.toString()))
        .map(({ month, count }) => ({
          month: new Date(month + "-01").toLocaleDateString("en-US", {
            month: "short",
          }),
          commits: count,
        })) || []
    );
  }, [selectedYear, contributions]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.[0]) return null;
    return (
      <div className="bg-[var(--text-primary)] text-[var(--bg-primary)] text-[10px] px-2 py-1.5 rounded-md shadow-lg">
        <span className="font-semibold">{payload[0].value}</span> commits in{" "}
        <span className="font-medium">{label}</span>
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 sm:p-7">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-5">
        Developer Timeline
      </h3>

      {/* Year tabs */}
      <div className="flex gap-1 mb-5 flex-wrap">
        {validYears.map(({ year }) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedYear === year
                ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
            }`}
          >
            {year}
          </button>
        ))}
        <button
          onClick={() => setSelectedYear("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedYear === "all"
              ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
              : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
          }`}
        >
          All Time
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedYear}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <div className="space-y-5">
            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <MetricBox label="Repositories" value={currentYearData.repos} />
              <MetricBox label="Commits" value={currentYearData.commits?.toLocaleString()} />
              <MetricBox label="Stars" value={currentYearData.stars} />
              <MetricBox label="Best Streak" value={currentYearData.streak} />
            </div>

            {/* Story */}
            {selectedYear !== "all" && (
              <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-subtle)]">
                <h4 className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1.5">
                  {selectedYear} Summary
                </h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  In {selectedYear}, you launched {currentYearData.repos}{" "}
                  project{currentYearData.repos !== 1 ? "s" : ""} with{" "}
                  {currentYearData.commits?.toLocaleString()} commits.
                  {currentYearData.topLanguage &&
                    ` Primary focus: ${currentYearData.topLanguage}.`}{" "}
                  {currentYearData.streak > 20
                    ? `A ${currentYearData.streak}-day streak showed strong dedication.`
                    : currentYearData.streak > 0
                      ? `Best streak: ${currentYearData.streak} days.`
                      : ""}
                </p>
              </div>
            )}

            {/* Chart */}
            {monthlyCommits.length > 0 && (
              <div className="h-36 sm:h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyCommits} barCategoryGap="20%">
                    <XAxis
                      dataKey="month"
                      stroke="var(--text-tertiary)"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="var(--text-tertiary)"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      width={30}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "transparent" }}
                    />
                    <Bar
                      dataKey="commits"
                      fill="var(--accent)"
                      fillOpacity={0.5}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function MetricBox({ label, value }) {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--border-subtle)]">
      <div className="text-lg sm:text-xl font-semibold text-[var(--text-primary)]">
        {value}
      </div>
      <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5">
        {label}
      </div>
    </div>
  );
}
