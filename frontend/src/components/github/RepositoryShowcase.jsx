import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, GitFork, ExternalLink } from "lucide-react";

export function RepositoryShowcase({ repositories }) {
  const [showAll, setShowAll] = useState(false);

  if (!repositories || repositories.length === 0) {
    return null;
  }

  const rankedRepos = [...repositories]
    .filter((r) => !r.fork && !r.archived)
    .sort((a, b) => {
      if (b.stars !== a.stars) return b.stars - a.stars;
      const aDays = Math.floor(
        (Date.now() - new Date(a.updatedAt).getTime()) / 86400000,
      );
      const bDays = Math.floor(
        (Date.now() - new Date(b.updatedAt).getTime()) / 86400000,
      );
      if (aDays !== bDays) return aDays - bDays;
      return (b.commitCount || 0) - (a.commitCount || 0);
    });

  const displayRepos = showAll ? rankedRepos : rankedRepos.slice(0, 6);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[20px] border border-gray-200 dark:border-gray-800 p-4 sm:p-6 md:p-10">
      <div className="flex items-center justify-between mb-4 sm:mb-8">
        <h3 className="text-heading-lg font-bold text-gray-900 dark:text-white">
          🏆 Signature Projects
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {rankedRepos.length} repositories
        </span>
      </div>

      <div className="space-y-3">
        {displayRepos.map((repo, idx) => (
          <motion.a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.06 }}
            whileHover={{ x: 4 }}
            className="group flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl px-3 py-3 sm:px-6 sm:py-4 transition-colors"
          >
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              {repo.language && (
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getLanguageColor(repo.language) }}
                />
              )}
              <div className="min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {repo.name}
                </h4>
                {repo.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {repo.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 ml-2 sm:ml-4">
              {repo.stars > 0 && (
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                  {repo.stars}
                </span>
              )}
              {repo.forks > 0 && (
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <GitFork className="w-3.5 h-3.5" />
                  {repo.forks}
                </span>
              )}
              <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.a>
        ))}
      </div>

      {!showAll && rankedRepos.length > 6 && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full mt-4 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          Show {rankedRepos.length - 6} more repositories →
        </button>
      )}
    </div>
  );
}

function getLanguageColor(language) {
  const colors = {
    JavaScript: "#f7df1e",
    TypeScript: "#3178c6",
    Python: "#3776ab",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Java: "#b07219",
    Go: "#00add8",
    Rust: "#dea584",
    PHP: "#4f5d95",
    Ruby: "#cc342d",
    Swift: "#fa7343",
    Kotlin: "#7f52ff",
    Dart: "#0175c2",
    "C++": "#00599c",
    C: "#a8b9cc",
  };
  return colors[language] || "#888";
}
