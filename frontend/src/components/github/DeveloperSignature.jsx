import React from "react";
import { motion } from "framer-motion";
import {
  Fingerprint,
  Zap,
  Brain,
  Heart,
  Target,
  Sparkles,
} from "lucide-react";

export function DeveloperSignature({
  metrics,
  contributions,
  repositories,
  username,
}) {
  if (!metrics) return null;

  const traits = calculateSignatureTraits(metrics, contributions, repositories);
  const codingDNA = generateCodingDNA(metrics, contributions);
  const archetypeData = determineArchetype(metrics, contributions, repositories);

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 sm:p-7">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-7 h-7 rounded-md bg-[var(--bg-tertiary)] flex items-center justify-center">
          <Fingerprint className="w-4 h-4 text-[var(--text-tertiary)]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            Developer Signature
          </h3>
          <p className="text-[11px] text-[var(--text-tertiary)]">
            Your unique coding identity
          </p>
        </div>
      </div>

      {/* Archetype */}
      <div className="mb-6 p-5 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-subtle)]">
        <div className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
          Developer Archetype
        </div>
        <div className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
          <span>{archetypeData.emoji}</span>
          <span>{archetypeData.title}</span>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
          {archetypeData.description}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {archetypeData.stats.map((stat, idx) => (
            <div key={idx} className="bg-[var(--bg-tertiary)] rounded-md p-2.5 border border-[var(--border-subtle)]">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                {stat.value}
              </div>
              <div className="text-[9px] text-[var(--text-tertiary)] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Coding DNA */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 mb-4">
          <Brain className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          <h4 className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
            Coding DNA
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {codingDNA.map((gene, idx) => (
            <div
              key={idx}
              className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-subtle)]"
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 bg-[var(--bg-tertiary)] rounded-md text-[var(--text-tertiary)]">
                  {gene.icon}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-[var(--text-primary)] mb-0.5">
                    {gene.trait}
                  </div>
                  <div className="text-[11px] text-[var(--text-tertiary)] leading-relaxed mb-2">
                    {gene.description}
                  </div>
                  <div className="h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${gene.strength}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + idx * 0.1, ease: "easeOut" }}
                      className="h-full bg-[var(--accent)] rounded-full"
                      style={{ opacity: 0.6 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Traits */}
      <div>
        <div className="flex items-center gap-1.5 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          <h4 className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
            Unique Traits
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {traits.map((trait, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]"
            >
              <div className="text-lg mb-2">{trait.icon}</div>
              <div className="text-xs font-medium text-[var(--text-primary)] mb-0.5">
                {trait.title}
              </div>
              <div className="text-[11px] text-[var(--text-tertiary)]">
                {trait.value}
              </div>
            </div>
          ))}
        </div>
      </div>
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

  if (devScore >= 85 && impactScore >= 75) {
    return {
      title: "The Architect",
      emoji: "🏗️",
      description:
        "You build with vision and precision. Your code doesn't just work — it stands the test of time.",
      stats: [
        { value: `${devScore}/100`, label: "Dev Score" },
        { value: totalCommits.toLocaleString(), label: "Total Commits" },
        { value: totalStars, label: "Stars" },
        { value: `${consistencyScore}/100`, label: "Consistency" },
      ],
    };
  } else if (consistencyScore >= 80) {
    return {
      title: "The Craftsperson",
      emoji: "⚒️",
      description:
        "Consistency is your superpower. Day after day, you show up and ship quality code.",
      stats: [
        { value: `${consistencyScore}/100`, label: "Consistency" },
        { value: totalCommits.toLocaleString(), label: "Commits" },
        { value: totalRepos, label: "Projects" },
        { value: contributions?.currentStreak || 0, label: "Streak" },
      ],
    };
  } else if (impactScore >= 70) {
    return {
      title: "The Innovator",
      emoji: "🚀",
      description:
        "You push boundaries and create impact. Your projects spark ideas and move the ecosystem forward.",
      stats: [
        { value: `${impactScore}/100`, label: "Impact" },
        { value: totalStars, label: "Stars" },
        { value: totalRepos, label: "Repos" },
        { value: totalCommits.toLocaleString(), label: "Commits" },
      ],
    };
  } else if (totalCommits >= 500) {
    return {
      title: "The Builder",
      emoji: "🔨",
      description:
        "You're here to build. Your contribution graph tells a story of action, iteration, and growth.",
      stats: [
        { value: totalCommits.toLocaleString(), label: "Commits" },
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
        "Every line of code is a step into the unknown. You're learning, experimenting, and finding your path.",
      stats: [
        { value: totalRepos, label: "Repos" },
        { value: totalCommits.toLocaleString(), label: "Commits" },
        { value: `${devScore}/100`, label: "Dev Score" },
        { value: "Growing", label: "Status" },
      ],
    };
  }
}

function generateCodingDNA(metrics, contributions) {
  const genes = [];

  const consistencyScore = metrics?.consistencyScore || 0;
  genes.push({
    trait: "Consistency",
    description:
      consistencyScore >= 80
        ? "Remarkably steady coding rhythm"
        : consistencyScore >= 60
          ? "Good habits with occasional bursts"
          : "Room for building daily momentum",
    strength: consistencyScore,
    icon: <Zap className="w-3.5 h-3.5" />,
  });

  const qualityScore = metrics?.qualityScore || 0;
  genes.push({
    trait: "Quality",
    description:
      qualityScore >= 80
        ? "Crafted with care — clean docs and structure"
        : qualityScore >= 60
          ? "Balancing speed with solid, maintainable code"
          : "Learning to refine — quality compounds over time",
    strength: qualityScore,
    icon: <Target className="w-3.5 h-3.5" />,
  });

  const impactScore = metrics?.impactScore || 0;
  genes.push({
    trait: "Impact",
    description:
      impactScore >= 70
        ? "Your work creates ripples in the ecosystem"
        : impactScore >= 50
          ? "Building meaningful projects that solve real problems"
          : "Every project builds momentum",
    strength: impactScore,
    icon: <Sparkles className="w-3.5 h-3.5" />,
  });

  genes.push({
    trait: "Community",
    description: "Part of a global network of builders",
    strength: Math.min(impactScore + 20, 100) || 30,
    icon: <Heart className="w-3.5 h-3.5" />,
  });

  return genes;
}

function calculateSignatureTraits(metrics, contributions, repositories) {
  const traits = [];

  const totalCommits = contributions?.totalCommits || 0;
  const avgCommitsPerDay = totalCommits > 0 ? (totalCommits / 365).toFixed(1) : 0;
  traits.push({
    icon: "⏰",
    title: "Code Velocity",
    value: `${avgCommitsPerDay} commits/day`,
  });

  const repoCount = repositories?.length || 0;
  const projectStyle =
    repoCount >= 20 ? "Portfolio Builder" :
    repoCount >= 10 ? "Active Explorer" : "Focused Creator";
  traits.push({
    icon: "🎨",
    title: "Project Style",
    value: projectStyle,
  });

  const longestStreak = contributions?.longestStreak || 0;
  const streakPower =
    longestStreak >= 30 ? "Marathon Runner" :
    longestStreak >= 14 ? "Consistent" : "Building Momentum";
  traits.push({
    icon: "🔥",
    title: "Streak Power",
    value: `${longestStreak} days · ${streakPower}`,
  });

  return traits;
}
