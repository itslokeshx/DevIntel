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
        ?.filter((y) => y.year >= 2025 && y.year <= 2026)
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

  // Generate monthly data for selected year
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
      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-gray-700">
        <span className="font-bold">{payload[0].value}</span> commits in{" "}
        <span className="font-medium">{label}</span>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-900/50 rounded-2xl sm:rounded-[24px] border border-gray-200 dark:border-gray-800 p-4 sm:p-6 md:p-10 shadow-lg">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-3">
        <span className="text-2xl">📜</span>
        Developer Timeline
      </h3>

      {/* Year tabs */}
      <div className="flex gap-2 mb-4 sm:mb-8 flex-wrap">
        {validYears.map(({ year }) => (
          <motion.button
            key={year}
            onClick={() => setSelectedYear(year)}
            whileTap={{ scale: 0.97 }}
            className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
              selectedYear === year
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {year}
          </motion.button>
        ))}
        <motion.button
          onClick={() => setSelectedYear("all")}
          whileTap={{ scale: 0.97 }}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
            selectedYear === "all"
              ? "bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-lg"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          All Time
        </motion.button>
      </div>

      {/* Year stats */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedYear}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          <div className="space-y-6">
            {/* Main metrics grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 sm:p-5 border border-blue-100 dark:border-blue-800/30">
                <div className="text-xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                  {currentYearData.repos}
                </div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">
                  Repositories
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 sm:p-5 border border-green-100 dark:border-green-800/30">
                <div className="text-xl sm:text-3xl font-extrabold text-green-600 dark:text-green-400">
                  {currentYearData.commits?.toLocaleString()}
                </div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">
                  Commits
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 sm:p-5 border border-amber-100 dark:border-amber-800/30">
                <div className="text-xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                  {currentYearData.stars}
                </div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">
                  Stars Earned
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 sm:p-5 border border-purple-100 dark:border-purple-800/30">
                <div className="text-xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                  {currentYearData.streak}
                </div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">
                  Best Streak
                </div>
              </div>
            </div>

            {/* Story narrative */}
            {selectedYear !== "all" && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 sm:p-5 border border-gray-100 dark:border-gray-700">
                <h4 className="font-semibold text-sm mb-2 text-gray-900 dark:text-gray-100">
                  📖 {selectedYear} Story
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  In {selectedYear}, you launched {currentYearData.repos}{" "}
                  project{currentYearData.repos !== 1 ? "s" : ""} with{" "}
                  {currentYearData.commits?.toLocaleString()} commits.
                  {currentYearData.topLanguage &&
                    ` Your primary focus was ${currentYearData.topLanguage},`}{" "}
                  demonstrating{" "}
                  {currentYearData.commits > 100 ? "exceptional" : "steady"}{" "}
                  consistency.{" "}
                  {currentYearData.streak > 20
                    ? `A remarkable ${currentYearData.streak}-day streak showed unwavering dedication.`
                    : currentYearData.streak > 0
                      ? `Your best streak was ${currentYearData.streak} days.`
                      : ""}
                </p>
              </div>
            )}

            {/* Monthly breakdown chart */}
            {monthlyCommits.length > 0 && (
              <div className="h-40 sm:h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyCommits} barCategoryGap="20%">
                    <XAxis
                      dataKey="month"
                      stroke="#9ca3af"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      width={35}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "transparent" }}
                    />
                    <Bar
                      dataKey="commits"
                      fill="url(#barGradient)"
                      radius={[6, 6, 0, 0]}
                    />
                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
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
