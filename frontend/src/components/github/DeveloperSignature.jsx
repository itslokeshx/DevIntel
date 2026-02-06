import React from "react";
import { motion } from "framer-motion";
import {
  Fingerprint,
  Zap,
  Brain,
  Heart,
  Target,
  Code2,
  Sparkles,
} from "lucide-react";

export function DeveloperSignature({
  metrics,
  contributions,
  repositories,
  username,
}) {
  if (!metrics) return null;

  // Calculate unique signature traits
  const traits = calculateSignatureTraits(metrics, contributions, repositories);
  const codingDNA = generateCodingDNA(metrics, contributions);
  const archetypeData = determineArchetype(
    metrics,
    contributions,
    repositories,
  );

  return (
    <div className="bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 dark:from-gray-900 dark:via-purple-900/10 dark:to-blue-900/10 rounded-2xl sm:rounded-[24px] border border-purple-200 dark:border-purple-800/30 p-4 sm:p-8 md:p-10 shadow-xl">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
            <Fingerprint className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-heading-lg font-bold text-gray-900 dark:text-white">
              Your Developer Signature
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              The unique DNA that defines your coding style
            </p>
          </div>
        </div>
      </div>

      {/* Archetype Card - Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mb-8 overflow-hidden rounded-3xl"
      >
        <div
          className={`p-5 sm:p-8 bg-gradient-to-br ${archetypeData.gradient} relative`}
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-20 blur-3xl" />

          <div className="relative z-10 text-white">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-sm font-semibold text-white/80 mb-2 uppercase tracking-wider">
                  Developer Archetype
                </div>
                <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-3 flex items-center gap-2 sm:gap-3">
                  <span>{archetypeData.emoji}</span>
                  <span>{archetypeData.title}</span>
                </div>
                <p className="text-sm sm:text-lg text-white/90 max-w-2xl leading-relaxed">
                  {archetypeData.description}
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
              {archetypeData.stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="bg-white/15 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
                >
                  <div className="text-xl sm:text-3xl font-extrabold">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/80 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Coding DNA - Genetic Traits */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
            Coding DNA
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {codingDNA.map((gene, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-white dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg">
                    {gene.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 dark:text-white mb-1 text-sm">
                      {gene.trait}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {gene.description}
                    </div>
                    {/* DNA bar */}
                    <div className="mt-3 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${gene.strength}%` }}
                        transition={{
                          duration: 1,
                          delay: 0.8 + idx * 0.1,
                          ease: "easeOut",
                        }}
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Signature Traits Grid */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
            Unique Traits
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {traits.map((trait, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className={`p-6 rounded-2xl border-2 ${trait.borderColor} ${trait.bgColor} hover:shadow-lg transition-all`}
            >
              <div className="text-3xl mb-3">{trait.icon}</div>
              <div className={`font-bold mb-2 ${trait.textColor}`}>
                {trait.title}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {trait.value}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl border border-purple-200 dark:border-purple-800/30"
      >
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            🎯 Your coding signature is evolving
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Keep building, learning, and refining your unique developer identity
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Helper functions
function determineArchetype(metrics, contributions, repositories) {
  const devScore = metrics?.devScore || 0;
  const consistencyScore = metrics?.consistencyScore || 0;
  const impactScore = metrics?.impactScore || 0;
  const totalCommits = contributions?.totalCommits || 0;
  const totalRepos = repositories?.length || 0;
  const totalStars =
    repositories?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0;

  // Determine archetype based on various metrics
  if (devScore >= 85 && impactScore >= 75) {
    return {
      title: "The Architect",
      emoji: "🏗️",
      description:
        "You build with vision and precision. Your code doesn't just work—it stands the test of time. You think in systems and solve problems before they happen.",
      gradient: "from-indigo-600 via-purple-600 to-pink-600",
      stats: [
        { value: `${devScore}/100`, label: "Dev Score" },
        { value: totalCommits.toLocaleString(), label: "Total Commits" },
        { value: totalStars, label: "Community Stars" },
        { value: `${consistencyScore}/100`, label: "Consistency" },
      ],
    };
  } else if (consistencyScore >= 80) {
    return {
      title: "The Craftsperson",
      emoji: "⚒️",
      description:
        "Consistency is your superpower. Day after day, you show up and ship quality code. Your dedication to the craft inspires others.",
      gradient: "from-orange-500 via-red-500 to-pink-500",
      stats: [
        { value: `${consistencyScore}/100`, label: "Consistency" },
        { value: totalCommits.toLocaleString(), label: "Commits" },
        { value: totalRepos, label: "Projects" },
        { value: contributions?.currentStreak || 0, label: "Day Streak" },
      ],
    };
  } else if (impactScore >= 70) {
    return {
      title: "The Innovator",
      emoji: "🚀",
      description:
        "You push boundaries and create impact. Your projects spark ideas and your contributions move the ecosystem forward.",
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      stats: [
        { value: `${impactScore}/100`, label: "Impact Score" },
        { value: totalStars, label: "Stars Earned" },
        { value: totalRepos, label: "Repositories" },
        { value: totalCommits.toLocaleString(), label: "Commits" },
      ],
    };
  } else if (totalCommits >= 500) {
    return {
      title: "The Builder",
      emoji: "🔨",
      description:
        "You're here to build, and build you do. Your contribution graph tells a story of action, iteration, and growth.",
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      stats: [
        { value: totalCommits.toLocaleString(), label: "Total Commits" },
        { value: totalRepos, label: "Projects" },
        { value: `${devScore}/100`, label: "Dev Score" },
        { value: contributions?.longestStreak || 0, label: "Best Streak" },
      ],
    };
  } else {
    return {
      title: "The Explorer",
      emoji: "🧭",
      description:
        "Every line of code is a step into the unknown. You're learning, experimenting, and discovering your path in the vast world of software.",
      gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
      stats: [
        { value: totalRepos, label: "Repositories" },
        { value: totalCommits.toLocaleString(), label: "Commits" },
        { value: `${devScore}/100`, label: "Dev Score" },
        { value: "Growing", label: "Status" },
      ],
    };
  }
}

function generateCodingDNA(metrics, contributions) {
  const genes = [];

  // Consistency Gene
  const consistencyScore = metrics?.consistencyScore || 0;
  genes.push({
    trait: "Consistency Helix",
    description:
      consistencyScore >= 80
        ? "Your code rhythm is remarkably steady—like a metronome of productivity"
        : consistencyScore >= 60
          ? "You maintain good coding habits with occasional power bursts"
          : "Your contribution pattern shows room for building daily momentum",
    strength: consistencyScore,
    icon: <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
  });

  // Quality Gene
  const qualityScore = metrics?.qualityScore || 0;
  genes.push({
    trait: "Quality Blueprint",
    description:
      qualityScore >= 80
        ? "Your code is crafted with care—documentation, structure, and polish"
        : qualityScore >= 60
          ? "You balance speed with quality, shipping solid, maintainable code"
          : "You're learning to refine your work—quality compounds over time",
    strength: qualityScore,
    icon: <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
  });

  // Impact Gene
  const impactScore = metrics?.impactScore || 0;
  genes.push({
    trait: "Impact Catalyst",
    description:
      impactScore >= 70
        ? "Your work creates ripples—others use, learn from, and build upon it"
        : impactScore >= 50
          ? "You're building meaningful projects that solve real problems"
          : "Your journey is just beginning—every project builds momentum",
    strength: impactScore,
    icon: <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
  });

  // Community Gene
  const stars = 0; // Can be calculated from repositories if needed
  const communityStrength = Math.min(stars * 10, 100);
  genes.push({
    trait: "Community Thread",
    description:
      communityStrength >= 70
        ? "You're a hub in the developer ecosystem—people notice and appreciate your work"
        : communityStrength >= 40
          ? "You're contributing to the community conversation with your projects"
          : "You're part of a global network of builders—your impact will grow",
    strength: communityStrength || 30,
    icon: <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />,
  });

  return genes;
}

function calculateSignatureTraits(metrics, contributions, repositories) {
  const traits = [];

  // Most Active Time
  const totalCommits = contributions?.totalCommits || 0;
  const avgCommitsPerDay =
    totalCommits > 0 ? (totalCommits / 365).toFixed(1) : 0;
  traits.push({
    icon: "⏰",
    title: "Code Velocity",
    value: `${avgCommitsPerDay} commits/day`,
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    textColor: "text-blue-900 dark:text-blue-300",
  });

  // Project Versatility
  const repoCount = repositories?.length || 0;
  const projectStyle =
    repoCount >= 20
      ? "Portfolio Builder"
      : repoCount >= 10
        ? "Active Explorer"
        : "Focused Creator";
  traits.push({
    icon: "🎨",
    title: "Project Style",
    value: projectStyle,
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    textColor: "text-purple-900 dark:text-purple-300",
  });

  // Streak Power
  const longestStreak = contributions?.longestStreak || 0;
  const streakPower =
    longestStreak >= 30
      ? "Marathon Runner"
      : longestStreak >= 14
        ? "Consistent Coder"
        : "Building Momentum";
  traits.push({
    icon: "🔥",
    title: "Streak Power",
    value: `${longestStreak} days · ${streakPower}`,
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    textColor: "text-orange-900 dark:text-orange-300",
  });

  return traits;
}
