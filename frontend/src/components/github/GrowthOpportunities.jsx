import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const numberEmojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];

export function GrowthOpportunities({ growthOps, metrics, repositories }) {
  const opportunities =
    growthOps && growthOps.length > 0
      ? growthOps
      : generateDeterministicOpportunities(metrics, repositories);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[20px] border border-gray-200 dark:border-gray-800 p-10">
      <h3 className="text-heading-lg font-bold text-gray-900 dark:text-white mb-8">
        🎯 Growth Opportunities
      </h3>

      <div className="space-y-4">
        {opportunities.map((opp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">
                {numberEmojis[index] || "🔹"}
              </span>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {opp.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {opp.gap}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  <ArrowRight className="w-4 h-4" />
                  <span>{opp.action}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/**
 * Deterministic opportunity detection (no AI needed)
 */
function generateDeterministicOpportunities(metrics, repositories) {
  const opportunities = [];

  // Calculate documentation score
  const reposWithReadme = repositories?.filter((r) => r.hasReadme).length || 0;
  const totalRepos = repositories?.length || 1;
  const docScore = Math.round((reposWithReadme / totalRepos) * 100);

  // 1. Documentation Quality
  if (docScore < 50) {
    opportunities.push({
      title: "Documentation Quality",
      gap: `Only ${docScore}% of repositories have comprehensive READMEs`,
      action:
        "Add detailed README files to your top 3 most-starred repositories this week. Include: project overview, installation steps, usage examples, and contribution guidelines.",
      impact:
        "Improves discoverability, demonstrates professionalism, and makes projects more accessible to collaborators and potential employers.",
      difficulty: "Easy",
    });
  }

  // 2. Consistency
  const consistencyScore = metrics?.consistencyScore || 0;
  if (consistencyScore < 70) {
    opportunities.push({
      title: "Commit Consistency",
      gap: `Consistency score of ${consistencyScore}/100 indicates irregular contribution patterns`,
      action:
        "Set a goal of 3-4 commits per week. Create a coding schedule and stick to it. Even small, incremental progress builds momentum.",
      impact:
        "Builds coding rhythm, improves skill retention, and demonstrates reliability to potential employers and collaborators.",
      difficulty: "Medium",
    });
  }

  // 3. Community Engagement
  const impactScore = metrics?.impactScore || 0;
  if (impactScore < 40) {
    opportunities.push({
      title: "Open Source Contributions",
      gap: "Limited external contributions detected",
      action:
        'Contribute to 1-2 open source projects this month. Start with documentation fixes or "good first issue" labels. Focus on projects you already use.',
      impact:
        "Expands your network, improves collaboration skills, and provides real-world experience with large codebases.",
      difficulty: "Medium",
    });
  }

  // 4. Streak Extension (if current streak > 20)
  const currentStreak = metrics?.currentStreak || 0;
  if (currentStreak > 20 && currentStreak < 90) {
    opportunities.push({
      title: "Streak Mastery",
      gap: `Current ${currentStreak}-day streak shows dedication`,
      action:
        "Challenge yourself to reach a 90-day streak. Set up automated reminders and prepare small tasks for busy days to maintain momentum.",
      impact:
        "Demonstrates exceptional consistency and discipline. 90+ day streaks place you in the top 5% of developers.",
      difficulty: "Hard",
    });
  }

  // Return top 3 opportunities
  return opportunities.slice(0, 3);
}
