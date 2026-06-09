import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trophy, Crown, BrainCircuit } from "lucide-react";
import { comparisonAPI } from "../services/api";
import { BattleArenaSetup } from "../components/comparison/BattleArenaSetup";
import { StreamingAIVerdict } from "../components/comparison/StreamingAIVerdict";
import {
  calculateBattleScore,
  determineBattleWinner,
} from "../utils/battleScore";
import CountUp from "react-countup";

export default function GitHubComparison() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [showBattleStart, setShowBattleStart] = useState(true);
  const [revealStage, setRevealStage] = useState(0);

  // Auto-advance reveal stage if no AI verdict exists
  useEffect(() => {
    if (data && revealStage === 1) {
      const aiComparison = data.comparison?.aiInsights;
      const hasAiVerdict = !!aiComparison?.verdict;

      if (!hasAiVerdict) {
        const timer = setTimeout(() => setRevealStage(2), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [data, revealStage]);

  const handleBattleStart = async (fighterA, fighterB) => {
    try {
      setLoading(true);
      setError(null);
      setShowBattleStart(false);

      const response = await comparisonAPI.compare(fighterA, fighterB);
      setData(response.data || response);
      setLoading(false);
      setTimeout(() => setRevealStage(1), 400);
    } catch (err) {
      console.error("Comparison error:", err);
      setError(err.message || "Failed to compare users");
      setLoading(false);
      setShowBattleStart(true);
    }
  };

  const handleNewBattle = () => {
    setData(null);
    setShowBattleStart(true);
    setError(null);
    setRevealStage(0);
  };

  if (showBattleStart && !data) {
    return (
      <BattleArenaSetup onBattleStart={handleBattleStart} loading={loading} />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative z-10 text-center space-y-6 px-4">
          {/* Main Spinner */}
          <motion.div
            className="relative mx-auto w-20 h-20"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 dark:border-blue-400/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400" />
          </motion.div>

          {/* Pulse Ring */}
          <motion.div
            className="absolute inset-0 mx-auto w-20 h-20 rounded-full border-2 border-blue-500/30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <p className="text-lg font-semibold text-[var(--text-primary)]">
              Analyzing profiles...
            </p>
            <motion.p
              className="text-sm text-[var(--text-tertiary)]"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Fetching GitHub data and generating AI insights
            </motion.p>
          </motion.div>

          {/* Loading Dots */}
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-[var(--accent)]"
                animate={{
                  y: [-8, 0, -8],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { userA, userB, comparison } = data;
  const scoreA = calculateBattleScore(userA);
  const scoreB = calculateBattleScore(userB);
  const battleResult = determineBattleWinner(scoreA.total, scoreB.total);
  const aiComparison = comparison?.aiInsights || null;

  // AI returns actual username as winner — map it back to "A"/"B"/"TIE"
  const rawAiWinner = aiComparison?.winner || null;
  const aiWinner = rawAiWinner
    ? rawAiWinner === "A" || rawAiWinner === "B" || rawAiWinner === "TIE"
      ? rawAiWinner
      : rawAiWinner.toLowerCase() === userA?.username?.toLowerCase()
        ? "A"
        : rawAiWinner.toLowerCase() === userB?.username?.toLowerCase()
          ? "B"
          : "TIE"
    : null;
  const aiWinnerName =
    aiWinner === "A"
      ? userA?.profile?.name || userA?.username
      : aiWinner === "B"
        ? userB?.profile?.name || userB?.username
        : "Tie";

  const repoCountA =
    comparison?.totalProjects?.userA ||
    comparison?.totalRepos?.userA ||
    userA?.repositories?.length ||
    0;
  const repoCountB =
    comparison?.totalProjects?.userB ||
    comparison?.totalRepos?.userB ||
    userB?.repositories?.length ||
    0;

  const metrics = [
    {
      label: "Repositories",
      valueA: repoCountA,
      valueB: repoCountB,
    },
    {
      label: "Stars Earned",
      valueA: comparison?.totalStars?.userA || 0,
      valueB: comparison?.totalStars?.userB || 0,
    },
    {
      label: "Total Commits",
      valueA: comparison?.totalCommits?.userA || 0,
      valueB: comparison?.totalCommits?.userB || 0,
    },
    {
      label: "Dev Score",
      valueA: comparison?.devScore?.userA || 0,
      valueB: comparison?.devScore?.userB || 0,
    },
    {
      label: "Consistency",
      valueA: comparison?.consistencyScore?.userA || 0,
      valueB: comparison?.consistencyScore?.userB || 0,
    },
    {
      label: "Impact",
      valueA: comparison?.impactScore?.userA || 0,
      valueB: comparison?.impactScore?.userB || 0,
    },
    {
      label: "Current Streak",
      valueA: comparison?.currentStreak?.userA || 0,
      valueB: comparison?.currentStreak?.userB || 0,
    },
    {
      label: "Doc Quality",
      valueA: Math.round(comparison?.avgDocQuality?.userA || 0),
      valueB: Math.round(comparison?.avgDocQuality?.userB || 0),
    },
  ];

  // Shared + unique languages
  const langsA = new Set((userA?.languages || []).map((l) => l.name));
  const langsB = new Set((userB?.languages || []).map((l) => l.name));
  const shared = [...langsA].filter((l) => langsB.has(l));
  const uniqueA = [...langsA].filter((l) => !langsB.has(l));
  const uniqueB = [...langsB].filter((l) => !langsA.has(l));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Enhanced Sticky Sub-header */}
      <div className="sticky top-14 z-50 glass border-b border-[var(--border-subtle)]">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 h-12 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-lg transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <h1 className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
              Battle Results
            </h1>
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
          </div>

          <button
            onClick={handleNewBattle}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg hover:opacity-90 transition-all"
          >
            <span className="hidden sm:inline">New Battle</span>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-sm sm:text-base"
            >
              ⚔️
            </motion.span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-6 sm:space-y-8">
        {/* 1. Overall Scores with Circular Progress */}
        <AnimatePresence>
          {revealStage >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative overflow-hidden bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-default)] p-6 sm:p-10 md:p-12">
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <h3 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] mb-1 tracking-tight">
                      Overall Score
                    </h3>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Comprehensive developer performance metrics
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-6 sm:gap-16">
                    <ScoreRing
                      username={userA?.username}
                      score={scoreA.total}
                      isWinner={battleResult.winner === "A"}
                      color="var(--accent)"
                    />
                    <div className="relative flex-shrink-0">
                      <div className="text-sm font-semibold text-[var(--text-tertiary)]">
                        VS
                      </div>
                    </div>
                    <ScoreRing
                      username={userB?.username}
                      score={scoreB.total}
                      isWinner={battleResult.winner === "B"}
                      color="var(--accent)"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. Profile Highlights */}
        <AnimatePresence>
          {revealStage >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-default)] p-5 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                      Developer Profiles
                    </h3>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Key metrics and technical identity
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <QuickStatsCard
                    accent="blue"
                    title={userA?.profile?.name || userA?.username}
                    username={userA?.username}
                    avatar={`https://github.com/${userA?.username}.png`}
                    stats={buildQuickStats(
                      userA,
                      repoCountA,
                      comparison?.totalStars?.userA || 0,
                    )}
                  />
                  <QuickStatsCard
                    accent="purple"
                    title={userB?.profile?.name || userB?.username}
                    username={userB?.username}
                    avatar={`https://github.com/${userB?.username}.png`}
                    stats={buildQuickStats(
                      userB,
                      repoCountB,
                      comparison?.totalStars?.userB || 0,
                    )}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Head-to-Head Metrics */}
        <AnimatePresence>
          {revealStage >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-default)] p-5 sm:p-8">
                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                    Head-to-Head Metrics
                  </h3>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Direct performance comparison across key indicators
                  </p>
                </div>
                <div className="space-y-7">
                  {metrics.map((m, i) => {
                    const maxVal = Math.max(m.valueA, m.valueB, 1);
                    const pctA = (m.valueA / maxVal) * 100;
                    const pctB = (m.valueB / maxVal) * 100;
                    const winnerSide =
                      m.valueA > m.valueB
                        ? "A"
                        : m.valueB > m.valueA
                          ? "B"
                          : null;

                    return (
                      <motion.div
                        key={m.label}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.08 }}
                      >
                        <div className="relative">
                          <div className="text-xs font-bold text-gray-400 dark:text-gray-500 text-center mb-3 tracking-wider uppercase">
                            {m.label}
                          </div>
                          <div className="flex items-center gap-2 sm:gap-4">
                            {/* User A value */}
                            <div className="w-12 sm:w-20 text-right">
                              <span
                                className={`font-semibold text-xs sm:text-base ${winnerSide === "A" ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"}`}
                              >
                                <CountUp
                                  end={m.valueA}
                                  duration={1.2}
                                  separator=","
                                />
                              </span>
                            </div>

                            {/* User A bar */}
                            <div className="flex-1 flex justify-end">
                              <div className="w-full h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-[var(--text-primary)] rounded-full float-right"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pctA}%` }}
                                  style={{ opacity: 0.8 }}
                                  transition={{
                                    duration: 1,
                                    delay: 0.7 + i * 0.08,
                                    ease: "easeOut",
                                  }}
                                />
                              </div>
                            </div>

                            {/* Center divider with winner indicator */}
                            <div className="relative w-6 sm:w-8 flex items-center justify-center">
                              <div className="w-px h-5 bg-[var(--border-default)]" />
                              {winnerSide && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    delay: 0.9 + i * 0.08,
                                    type: "spring",
                                  }}
                                  className="absolute w-4.5 h-4.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] flex items-center justify-center text-[9px] font-bold"
                                >
                                  ✓
                                </motion.div>
                              )}
                            </div>

                            {/* User B bar */}
                            <div className="flex-1">
                              <div className="w-full h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-[var(--text-primary)] rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pctB}%` }}
                                  style={{ opacity: 0.8 }}
                                  transition={{
                                    duration: 1,
                                    delay: 0.7 + i * 0.08,
                                    ease: "easeOut",
                                  }}
                                />
                              </div>
                            </div>

                            {/* User B value */}
                            <div className="w-12 sm:w-20 text-left">
                              <span
                                className={`font-semibold text-xs sm:text-base ${winnerSide === "B" ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"}`}
                              >
                                <CountUp
                                  end={m.valueB}
                                  duration={1.2}
                                  separator=","
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Legend */}
                  <div className="flex justify-between items-center pt-5 mt-4 border-t border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[var(--text-primary)]">
                        @{userA?.username}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[var(--text-primary)]">
                        @{userB?.username}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. AI Verdict & Analysis */}
        <AnimatePresence>
          {revealStage >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-default)] p-5 sm:p-8">
                {/* Header */}
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-7 h-7 rounded-md bg-[var(--bg-tertiary)] flex items-center justify-center">
                    <BrainCircuit className="w-4 h-4 text-[var(--text-tertiary)]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      AI Analysis
                    </h3>
                  </div>
                </div>

                {/* AI Verdict Text */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-5 mb-5">
                  <div className="text-[var(--text-secondary)] leading-relaxed text-xs sm:text-sm">
                    {aiComparison?.verdict ? (
                      <StreamingAIVerdict
                        text={aiComparison.verdict}
                        onComplete={() =>
                          setTimeout(() => setRevealStage(2), 500)
                        }
                      />
                    ) : (
                      <p className="text-[var(--text-tertiary)] italic">
                        AI analysis unavailable for this comparison.
                      </p>
                    )}
                  </div>
                </div>

                {/* Winner Declaration */}
                {aiComparison?.winner && (
                  <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-subtle)]">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                          Winner
                        </div>
                        <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                          {aiWinnerName}
                        </div>
                        {aiComparison?.winReason && (
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            {aiComparison.winReason}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. Tech Stack Overlap */}
        <AnimatePresence>
          {revealStage >= 1 && (langsA.size > 0 || langsB.size > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-default)] p-5 sm:p-8">
                <div className="text-center mb-6">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                    Technology Overlap
                  </h3>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Analyzing shared and unique technical stacks
                  </p>
                </div>

                <div className="flex items-center justify-center gap-0 relative h-36">
                  {/* Circle A */}
                  <motion.div
                    initial={{ x: 30, opacity: 0, scale: 0.95 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="w-24 h-24 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-default)] flex items-center justify-center relative -mr-6"
                  >
                    <div className="text-center pr-4">
                      <div className="text-lg font-semibold text-[var(--text-primary)]">
                        {uniqueA.length}
                      </div>
                      <div className="text-[9px] text-[var(--text-tertiary)] uppercase tracking-wider">
                        Unique
                      </div>
                    </div>
                  </motion.div>

                  {/* Shared count */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="absolute z-15 bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl w-14 h-14 flex flex-col items-center justify-center"
                  >
                    <div className="text-lg font-semibold text-[var(--text-primary)]">
                      {shared.length}
                    </div>
                    <div className="text-[9px] text-[var(--text-tertiary)] uppercase">
                      Shared
                    </div>
                  </motion.div>

                  {/* Circle B */}
                  <motion.div
                    initial={{ x: -30, opacity: 0, scale: 0.95 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="w-24 h-24 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-default)] flex items-center justify-center relative -ml-6"
                  >
                    <div className="text-center pl-4">
                      <div className="text-lg font-semibold text-[var(--text-primary)]">
                        {uniqueB.length}
                      </div>
                      <div className="text-[9px] text-[var(--text-tertiary)] uppercase tracking-wider">
                        Unique
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Labels */}
                <div className="flex justify-between items-center mt-5 px-4">
                  <span className="text-xs font-semibold text-[var(--text-primary)]">
                    @{userA?.username}
                  </span>
                  <span className="text-xs font-semibold text-[var(--text-primary)]">
                    @{userB?.username}
                  </span>
                </div>

                {/* Shared languages list */}
                {shared.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-center"
                  >
                    <div className="inline-block px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                      <p className="text-[10px] font-medium text-[var(--text-tertiary)] mb-1 uppercase tracking-wider">
                        Common Technologies
                      </p>
                      <p className="text-xs font-medium text-[var(--text-primary)]">
                        {shared.join(" · ")}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 6. Final Winner Declaration */}
        <AnimatePresence>
          {revealStage >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-default)] p-5 sm:p-8">
                <div className="relative z-10">
                  {/* Check AI winner first, fallback to battleResult */}
                  {aiWinner === "TIE" ||
                  (!aiWinner && battleResult.winner === "TIE") ? (
                    <div className="text-center py-4">
                      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                        Perfect Draw!
                      </h2>
                      <p className="text-xs text-[var(--text-tertiary)] max-w-sm mx-auto">
                        Both developers demonstrate exceptional and equivalent skills
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-col items-center">
                        <motion.img
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          src={`https://github.com/${
                            aiWinner && aiWinner !== "TIE"
                              ? aiWinner === "A"
                                ? userA?.username
                                : userB?.username
                              : battleResult.winner === "A"
                                ? userA?.username
                                : userB?.username
                          }.png`}
                          alt="Winner"
                          className="w-16 h-16 rounded-full mb-3 border border-[var(--border-default)]"
                        />

                        <div className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                          Final Winner
                        </div>

                        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                          {aiWinner && aiWinner !== "TIE"
                            ? aiWinnerName
                            : battleResult.winner === "A"
                              ? userA?.profile?.name || userA?.username
                              : userB?.profile?.name || userB?.username}
                        </h2>

                        <p className="text-xs text-[var(--text-tertiary)] max-w-sm text-center">
                          {aiComparison?.winReason || battleResult.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* Circular SVG score ring */
function ScoreRing({ username, score, isWinner, color }) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(score, 100);
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <div className="relative">
        <svg
          width="100"
          height="100"
          className="-rotate-90 sm:w-[140px] sm:h-[140px]"
          viewBox="0 0 140 140"
        >
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="currentColor"
            className="text-[var(--bg-tertiary)]"
            strokeWidth="10"
            fill="none"
          />
          <motion.circle
            cx="70"
            cy="70"
            r={radius}
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <img
            src={`https://github.com/${username}.png`}
            alt={username}
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full mb-0.5 sm:mb-1"
          />
          <span className="text-lg sm:text-2xl font-semibold text-[var(--text-primary)]">
            <CountUp end={score} duration={1.5} />
          </span>
        </div>
      </div>
      <span className="text-xs sm:text-sm font-medium text-[var(--text-tertiary)] truncate max-w-[80px] sm:max-w-none">
        @{username}
      </span>
    </div>
  );
}

function buildQuickStats(user, repoCount, totalStars) {
  return [
    {
      label: "Followers",
      value: user?.profile?.followers ?? 0,
      isNumber: true,
    },
    {
      label: "Following",
      value: user?.profile?.following ?? 0,
      isNumber: true,
    },
    {
      label: "Primary Tech",
      value: user?.metrics?.primaryTechIdentity || "N/A",
      isNumber: false,
    },
    {
      label: "Top Language",
      value: getTopLanguage(user) || "N/A",
      isNumber: false,
    },
    { label: "Repos", value: repoCount, isNumber: true },
    { label: "Stars", value: totalStars, isNumber: true },
  ];
}

function getTopLanguage(user) {
  const stats = user?.metrics?.languageStats;
  if (!Array.isArray(stats) || stats.length === 0) return null;
  const sorted = [...stats].sort(
    (a, b) => (b.count || b.repos || 0) - (a.count || a.repos || 0),
  );
  return sorted[0]?.name || null;
}

function QuickStatsCard({ accent, title, username, avatar, stats }) {
  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4 sm:p-5 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[var(--border-subtle)]">
          <img
            src={avatar}
            alt={username}
            className="w-10 h-10 rounded-full border border-[var(--border-default)]"
          />
          <div className="flex-1 min-w-0">
            <span className="font-semibold text-[var(--text-primary)] text-sm sm:text-base truncate block">
              {title}
            </span>
            <div className="text-[10px] text-[var(--text-tertiary)]">
              @{username}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatItem({ stat }) {
  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-3 py-2.5">
      <div className="text-[10px] font-medium text-[var(--text-tertiary)] mb-1 uppercase tracking-wider">
        {stat.label}
      </div>
      <div className="text-sm font-semibold text-[var(--text-primary)] truncate">
        <StatValue value={stat.value} isNumber={stat.isNumber} />
      </div>
    </div>
  );
}

function StatValue({ value, isNumber }) {
  if (isNumber) {
    return <CountUp end={Number(value) || 0} duration={1} separator="," />;
  }
  return <span className="truncate block">{value}</span>;
}
