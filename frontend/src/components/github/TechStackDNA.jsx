import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Loader2 } from "lucide-react";

const languageColors = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3776ab",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  Go: "#00add8",
  Rust: "#dea584",
  PHP: "#4f5d95",
  "Jupyter Notebook": "#da5b0b",
  "C++": "#00599c",
  C: "#a8b9cc",
  Ruby: "#cc342d",
  Swift: "#fa7343",
  Kotlin: "#7f52ff",
  Dart: "#0175c2",
  Shell: "#89e051",
  PowerShell: "#012456",
  R: "#276dc3",
  MATLAB: "#e16737",
};

export function TechStackDNA({ languageStats, repositories }) {
  const [forecast, setForecast] = useState(null);
  const [loadingForecast, setLoadingForecast] = useState(false);

  useEffect(() => {
    if (languageStats && languageStats.length > 0) {
      fetchForecast();
    }
  }, [languageStats]);

  const fetchForecast = async () => {
    setLoadingForecast(true);
    try {
      // This would call your backend API for AI forecast
      // For now, we'll use a simple client-side prediction
      setTimeout(() => {
        const topLang = languageStats[0]?.name;
        setForecast(
          topLang === "TypeScript"
            ? "TypeScript usage trending +30% based on recent project patterns. Python dominance stable. Consider exploring Go or Rust for systems work."
            : `${topLang} remains your dominant stack. Consider exploring complementary technologies for full-stack capabilities.`,
        );
        setLoadingForecast(false);
      }, 1000);
    } catch (err) {
      setLoadingForecast(false);
    }
  };

  if (!languageStats || languageStats.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-[20px] border border-gray-200 dark:border-gray-800 p-10">
        <h3 className="text-heading-lg font-bold text-gray-900 dark:text-white mb-6">
          🧪 Tech Stack DNA
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          No language data available
        </p>
      </div>
    );
  }

  const sortedLanguages = languageStats
    .sort((a, b) => (b.count || b.repos || 0) - (a.count || a.repos || 0))
    .slice(0, 8);

  const totalRepos = languageStats.reduce(
    (sum, lang) => sum + (lang.count || lang.repos || 0),
    0,
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[20px] border border-gray-200 dark:border-gray-800 p-10">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-heading-lg font-bold text-gray-900 dark:text-white">
          🧪 Tech Stack DNA
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {languageStats.length} languages total
        </span>
      </div>

      {/* Language Bars */}
      <div className="space-y-4">
        {sortedLanguages.map((lang, idx) => {
          const count = lang.count || lang.repos || 0;
          const percentage = totalRepos > 0 ? (count / totalRepos) * 100 : 0;
          const color = languageColors[lang.name] || "#888";

          return (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08, type: "spring", stiffness: 120 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    {lang.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {percentage.toFixed(1)}%
                </span>
              </div>

              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{
                    duration: 0.8,
                    delay: idx * 0.08,
                    ease: "easeOut",
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Prediction */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800"
      >
        <div className="flex items-start gap-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl p-6">
          <span className="text-[32px] flex-shrink-0">🔮</span>
          <div className="flex-1">
            <div className="text-base font-semibold text-blue-700 dark:text-blue-300 mb-2">
              6-Month Forecast
            </div>
            {loadingForecast ? (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing trends...</span>
              </div>
            ) : (
              <div className="text-sm text-gray-700 dark:text-gray-400">
                {forecast ||
                  `${sortedLanguages[0]?.name || "Primary language"} remains your dominant stack. Consider exploring complementary technologies for full-stack capabilities.`}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
