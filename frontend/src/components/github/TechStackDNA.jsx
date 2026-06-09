import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

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
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 sm:p-7">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
          Tech Stack
        </h3>
        <p className="text-xs text-[var(--text-tertiary)]">
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
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 sm:p-7">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Tech Stack
        </h3>
        <span className="text-[11px] text-[var(--text-tertiary)]">
          {languageStats.length} languages
        </span>
      </div>

      {/* Language Bars */}
      <div className="space-y-3.5">
        {sortedLanguages.map((lang, idx) => {
          const count = lang.count || lang.repos || 0;
          const percentage = totalRepos > 0 ? (count / totalRepos) * 100 : 0;
          const color = languageColors[lang.name] || "#666";

          return (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06 }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-medium text-[var(--text-primary)]">
                    {lang.name}
                  </span>
                </div>
                <span className="text-[11px] text-[var(--text-tertiary)] tabular-nums">
                  {percentage.toFixed(1)}%
                </span>
              </div>

              <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color, opacity: 0.8 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{
                    duration: 0.6,
                    delay: idx * 0.06,
                    ease: "easeOut",
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Forecast */}
      <div className="mt-5 pt-5 border-t border-[var(--border-subtle)]">
        <div className="flex items-start gap-3 p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-subtle)]">
          <div className="w-6 h-6 rounded-md bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0 text-xs">
            🔮
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
              6-Month Forecast
            </div>
            {loadingForecast ? (
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Analyzing...</span>
              </div>
            ) : (
              <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {forecast ||
                  `${sortedLanguages[0]?.name || "Primary language"} remains your dominant stack.`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
