import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trophy, Crown } from "lucide-react";
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
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Analyzing profiles...
          </p>
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
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Enhanced Sticky Sub-header */}
      <div className="sticky top-[72px] z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl border-b-2 border-gray-200/80 dark:border-gray-800/80 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-500" />
            <h1 className="text-xs sm:text-base font-black text-gray-900 dark:text-white tracking-tight">
              Battle Results
            </h1>
            <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
          </div>

          <button
            onClick={handleNewBattle}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg sm:rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 hover:scale-105"
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 rounded-2xl sm:rounded-[24px] border border-gray-200/80 dark:border-gray-800 shadow-lg p-5 sm:p-10 md:p-14">
                {/* Premium background pattern */}
                <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
                      backgroundSize: "32px 32px",
                    }}
                  />
                </div>

                <div className="relative z-10">
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 mb-4">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                        BATTLE RESULTS
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2">
                      Overall Score
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Comprehensive developer performance metrics
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-4 sm:gap-12 md:gap-24">
                    <ScoreRing
                      username={userA?.username}
                      score={scoreA.total}
                      isWinner={battleResult.winner === "A"}
                      color="#3b82f6"
                    />
                    <div className="relative">
                      <div className="text-3xl font-black text-gray-300 dark:text-gray-700">
                        VS
                      </div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute -inset-4 border border-dashed border-gray-200 dark:border-gray-800 rounded-full opacity-30"
                      />
                    </div>
                    <ScoreRing
                      username={userB?.username}
                      score={scoreB.total}
                      isWinner={battleResult.winner === "B"}
                      color="#a855f7"
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-[24px] border border-gray-200 dark:border-gray-800 shadow-lg p-5 sm:p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                      Developer Profiles
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Key metrics and technical identity
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Live Data
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-[24px] border border-gray-200 dark:border-gray-800 shadow-lg p-5 sm:p-8 md:p-10">
                <div className="text-center mb-6 sm:mb-10">
                  <h3 className="text-xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">
                    Head-to-Head Metrics
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Direct performance comparison across 8 key indicators
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
                                className={`font-black text-sm sm:text-xl ${winnerSide === "A" ? "text-blue-500" : "text-gray-300 dark:text-gray-600"}`}
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
                              <div className="w-full h-2.5 sm:h-4 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-850 rounded-full overflow-hidden shadow-inner">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full float-right shadow-lg"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pctA}%` }}
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
                              <div className="w-0.5 h-6 sm:h-8 bg-gray-200 dark:bg-gray-700" />
                              {winnerSide && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    delay: 0.9 + i * 0.08,
                                    type: "spring",
                                  }}
                                  className={`absolute w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${
                                    winnerSide === "A"
                                      ? "bg-blue-500 text-white"
                                      : "bg-purple-500 text-white"
                                  }`}
                                >
                                  ✓
                                </motion.div>
                              )}
                            </div>

                            {/* User B bar */}
                            <div className="flex-1">
                              <div className="w-full h-2.5 sm:h-4 bg-gradient-to-l from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-850 rounded-full overflow-hidden shadow-inner">
                                <motion.div
                                  className="h-full bg-gradient-to-l from-purple-600 to-purple-500 rounded-full shadow-lg"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pctB}%` }}
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
                                className={`font-black text-sm sm:text-xl ${winnerSide === "B" ? "text-purple-500" : "text-gray-300 dark:text-gray-600"}`}
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

                  {/* Enhanced Legend */}
                  <div className="flex justify-between items-center pt-6 mt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                      <span className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg shadow-blue-500/30" />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        @{userA?.username}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        @{userB?.username}
                      </span>
                      <span className="w-4 h-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full shadow-lg shadow-purple-500/30" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. AI Verdict & Analysis */}
        <AnimatePresence>
          {revealStage >= 1 && aiComparison?.verdict && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-[24px] border border-gray-200 dark:border-gray-800 shadow-lg p-5 sm:p-8 md:p-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">🧑‍⚖️</span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                      AI Analysis
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Powered by Llama
                    </p>
                  </div>
                </div>

                {/* AI Verdict Text */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-[15px]">
                    <StreamingAIVerdict
                      text={aiComparison?.verdict}
                      onComplete={() =>
                        setTimeout(() => setRevealStage(2), 500)
                      }
                    />
                  </div>
                </div>

                {/* Winner Declaration */}
                {aiComparison?.winner && (
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800/40">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                        <span className="text-white text-xl">🏆</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase tracking-wider mb-1">
                          Winner
                        </div>
                        <div className="text-xl font-black text-gray-900 dark:text-white mb-2">
                          {aiWinnerName}
                        </div>
                        {aiComparison?.winReason && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 rounded-2xl sm:rounded-[24px] border border-gray-200 dark:border-gray-800 shadow-lg p-5 sm:p-8 md:p-10">
                <div className="text-center mb-10">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                    Technology Overlap
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Analyzing shared and unique technical stacks
                  </p>
                </div>

                <div className="flex items-center justify-center gap-0 relative h-48 sm:h-64">
                  {/* Circle A - Enhanced */}
                  <motion.div
                    initial={{ x: 60, opacity: 0, scale: 0.8 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="w-36 h-36 sm:w-52 sm:h-52 rounded-full bg-gradient-to-br from-blue-500/20 via-blue-400/15 to-blue-500/20 dark:from-blue-500/15 dark:via-blue-400/10 dark:to-blue-500/15 border-2 border-blue-400/40 dark:border-blue-400/30 flex items-center justify-center relative -mr-10 sm:-mr-16 shadow-xl shadow-blue-500/10"
                  >
                    <div className="text-center pr-10">
                      <div className="text-4xl font-black text-blue-500 mb-1">
                        {uniqueA.length}
                      </div>
                      <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        Unique
                      </div>
                    </div>
                  </motion.div>

                  {/* Shared count - Premium design */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
                    className="absolute z-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-2xl w-20 h-20 flex flex-col items-center justify-center shadow-2xl"
                  >
                    <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-purple-500">
                      {shared.length}
                    </div>
                    <div className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">
                      Shared
                    </div>
                  </motion.div>

                  {/* Circle B - Enhanced */}
                  <motion.div
                    initial={{ x: -60, opacity: 0, scale: 0.8 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="w-36 h-36 sm:w-52 sm:h-52 rounded-full bg-gradient-to-bl from-purple-500/20 via-purple-400/15 to-purple-500/20 dark:from-purple-500/15 dark:via-purple-400/10 dark:to-purple-500/15 border-2 border-purple-400/40 dark:border-purple-400/30 flex items-center justify-center relative -ml-10 sm:-ml-16 shadow-xl shadow-purple-500/10"
                  >
                    <div className="text-center pl-10">
                      <div className="text-4xl font-black text-purple-500 mb-1">
                        {uniqueB.length}
                      </div>
                      <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                        Unique
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Enhanced Labels */}
                <div className="flex justify-between items-center mt-6 sm:mt-8 px-4 sm:px-12">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                    <span className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                      @{userA?.username}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                    <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                      @{userB?.username}
                    </span>
                    <span className="w-3 h-3 bg-purple-500 rounded-full" />
                  </div>
                </div>

                {/* Shared languages list - Enhanced */}
                {shared.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 text-center"
                  >
                    <div className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider">
                        Common Technologies
                      </p>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {shared.join(" • ")}
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
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.4, delay: 0.2 }}
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-50 dark:from-yellow-900/10 dark:via-amber-900/5 dark:to-orange-900/10 rounded-2xl sm:rounded-[24px] border-2 border-yellow-200/60 dark:border-yellow-800/40 shadow-xl p-5 sm:p-8 md:p-10">
                {/* Subtle shine effect */}
                <motion.div
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  style={{ transform: "skewX(-20deg)" }}
                />

                <div className="relative z-10">
                  {/* Check AI winner first, fallback to battleResult */}
                  {aiWinner === "TIE" ||
                  (!aiWinner && battleResult.winner === "TIE") ? (
                    <div className="text-center">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.3 }}
                        className="text-5xl mb-4 block"
                      >
                        🤝
                      </motion.span>
                      <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
                        Perfect Draw!
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        Both developers demonstrate exceptional and equivalent
                        skills
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border border-yellow-300/30 dark:border-yellow-700/30 mb-4">
                          <Trophy className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-500" />
                          <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase tracking-wider">
                            Final Verdict
                          </span>
                        </div>

                        <motion.img
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.4, type: "spring" }}
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
                          className="w-20 h-20 rounded-full mb-4 border-3 border-white dark:border-gray-800 shadow-xl ring-2 ring-yellow-400/40"
                        />

                        <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 dark:from-yellow-400 dark:via-amber-400 dark:to-orange-400 mb-2 sm:mb-3">
                          {aiWinner && aiWinner !== "TIE"
                            ? aiWinnerName
                            : battleResult.winner === "A"
                              ? userA?.profile?.name || userA?.username
                              : userB?.profile?.name || userB?.username}
                        </h2>

                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium max-w-xl text-center mb-6">
                          {aiComparison?.winReason || battleResult.description}
                        </p>

                        {/* Score Display */}
                        <div className="inline-flex items-center gap-4 sm:gap-6 bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm px-5 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 mb-4 sm:mb-6">
                          <div className="text-center">
                            <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">
                              Winner
                            </div>
                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">
                              {(aiWinner && aiWinner !== "TIE"
                                ? aiWinner
                                : battleResult.winner) === "A"
                                ? scoreA.total
                                : scoreB.total}
                            </span>
                          </div>

                          <div className="w-px h-10 bg-gray-300 dark:bg-gray-700" />

                          <div className="text-center">
                            <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">
                              Runner-up
                            </div>
                            <span className="text-2xl font-black text-gray-400 dark:text-gray-600">
                              {(aiWinner && aiWinner !== "TIE"
                                ? aiWinner
                                : battleResult.winner) === "A"
                                ? scoreB.total
                                : scoreA.total}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Fighter Cards */}
                      <div className="flex items-center justify-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/30">
                          <span className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                            @{userA?.username}
                          </span>
                        </div>

                        <div className="text-xl font-black text-gray-400 dark:text-gray-600">
                          ⚔️
                        </div>

                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/30">
                          <span className="w-3 h-3 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" />
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                            @{userB?.username}
                          </span>
                        </div>
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
            className="text-gray-100 dark:text-gray-800"
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
          <span className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white">
            <CountUp end={score} duration={1.5} />
          </span>
        </div>
      </div>
      <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate max-w-[80px] sm:max-w-none">
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
  const accentClasses =
    accent === "purple"
      ? "border-purple-300/60 dark:border-purple-700/50 bg-gradient-to-br from-purple-50/80 via-white to-purple-50/50 dark:from-purple-900/20 dark:via-gray-800 dark:to-purple-900/10"
      : "border-blue-300/60 dark:border-blue-700/50 bg-gradient-to-br from-blue-50/80 via-white to-blue-50/50 dark:from-blue-900/20 dark:via-gray-800 dark:to-blue-900/10";

  const dotClass =
    accent === "purple"
      ? "bg-purple-500 shadow-lg shadow-purple-500/40"
      : "bg-blue-500 shadow-lg shadow-blue-500/40";
  const glowClass =
    accent === "purple" ? "shadow-purple-500/20" : "shadow-blue-500/20";

  return (
    <div
      className={`rounded-2xl border-2 ${accentClasses} p-4 sm:p-6 relative overflow-hidden shadow-xl ${glowClass}`}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-5 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <img
              src={avatar}
              alt={username}
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-white dark:border-gray-800 shadow-lg"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full ${dotClass} border-2 border-white dark:border-gray-800`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-black text-gray-900 dark:text-white text-base sm:text-lg truncate">
                {title}
              </span>
            </div>
            <div className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">
              @{username}
            </div>
          </div>
          <span
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${dotClass} animate-pulse`}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} accent={accent} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatItem({ stat, accent }) {
  const hoverClass =
    accent === "purple"
      ? "hover:border-purple-300 dark:hover:border-purple-700"
      : "hover:border-blue-300 dark:hover:border-blue-700";

  return (
    <div
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 transition-all duration-200 ${hoverClass} group`}
    >
      <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wide">
        {stat.label}
      </div>
      <div className="text-base font-black text-gray-900 dark:text-white group-hover:scale-105 transition-transform">
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
