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
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 sm:p-7">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Repositories
        </h3>
        <span className="text-[11px] text-[var(--text-tertiary)]">
          {rankedRepos.length} projects
        </span>
      </div>

      <div className="space-y-1">
        {displayRepos.map((repo, idx) => (
          <motion.a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="group flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-[var(--surface-hover)] transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {repo.language && (
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getLanguageColor(repo.language) }}
                />
              )}
              <div className="min-w-0">
                <h4 className="text-[13px] font-medium text-[var(--text-primary)] truncate">
                  {repo.name}
                </h4>
                {repo.description && (
                  <p className="text-[11px] text-[var(--text-tertiary)] truncate mt-0.5">
                    {repo.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0 ml-3">
              {repo.stars > 0 && (
                <span className="flex items-center gap-1 text-[11px] text-[var(--text-tertiary)]">
                  <Star className="w-3 h-3" />
                  {repo.stars}
                </span>
              )}
              {repo.forks > 0 && (
                <span className="flex items-center gap-1 text-[11px] text-[var(--text-tertiary)]">
                  <GitFork className="w-3 h-3" />
                  {repo.forks}
                </span>
              )}
              <ExternalLink className="w-3 h-3 text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.a>
        ))}
      </div>

      {!showAll && rankedRepos.length > 6 && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full mt-3 py-2.5 text-xs font-medium text-[var(--accent)] hover:text-[var(--text-primary)] transition-colors"
        >
          Show {rankedRepos.length - 6} more →
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
  return colors[language] || "#666";
}
