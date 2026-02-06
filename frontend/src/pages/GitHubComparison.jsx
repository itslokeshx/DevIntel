import React, { useState } from "react";
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

  const { userA, userB, comparison, aiInsights } = data;
  const scoreA = calculateBattleScore(userA);
  const scoreB = calculateBattleScore(userB);
  const battleResult = determineBattleWinner(scoreA.total, scoreB.total);
  const aiComparison = comparison?.aiInsights || null;
  const aiWinner = aiComparison?.winner || null;
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
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-[72px]">
      {/* Sub-header with back + new battle */}
      <div className="sticky top-[72px] z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate("/compare")}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
            Battle Results
          </h1>
          <button
            onClick={handleNewBattle}
            className="px-4 py-2 text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:opacity-90 transition-opacity"
          >
            New Battle
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* AI Referee Verdict */}
        <AnimatePresence>
          {revealStage >= 1 &&
            (aiComparison?.verdict || aiInsights?.comparison) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-gray-900 dark:bg-gray-800 rounded-[20px] p-8 md:p-10">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">🧑‍⚖️</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-3">
                        AI Referee Verdict
                      </h3>
                      <div className="text-gray-300 leading-relaxed">
                        <StreamingAIVerdict
                          text={aiComparison?.verdict || aiInsights?.comparison}
                          onComplete={() =>
                            setTimeout(() => setRevealStage(2), 500)
                          }
                        />
                      </div>
                      {aiComparison?.winner && (
                        <div className="mt-4 text-sm text-gray-200">
                          <span className="font-semibold text-white">
                            AI Winner:
                          </span>{" "}
                          <span className="text-amber-300">{aiWinnerName}</span>
                          {aiComparison?.winReason && (
                            <span className="text-gray-400">
                              {" "}
                              — {aiComparison.winReason}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
        </AnimatePresence>

        {/* Clear Winner Declaration */}
        <AnimatePresence>
          {revealStage >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 rounded-[20px] border border-gray-200 dark:border-gray-800 p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                      Declared Winner
                    </div>
                    <div className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                      {aiWinner && aiWinner !== "TIE"
                        ? aiWinnerName
                        : battleResult.winner === "TIE"
                          ? "Tie"
                          : battleResult.winner === "A"
                            ? userA?.profile?.name || userA?.username
                            : userB?.profile?.name || userB?.username}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {aiComparison?.winReason || battleResult.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        @{userA?.username}
                      </span>
                    </div>
                    <span className="text-gray-300 dark:text-gray-600">VS</span>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-purple-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        @{userB?.username}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overall Scores with Circular Progress */}
        <AnimatePresence>
          {revealStage >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white dark:bg-gray-900 rounded-[20px] border border-gray-200 dark:border-gray-800 p-8 md:p-10">
                <h3 className="text-heading-lg font-bold text-gray-900 dark:text-white text-center mb-10">
                  Overall Score
                </h3>
                <div className="flex items-center justify-center gap-12 md:gap-20">
                  <ScoreRing
                    username={userA?.username}
                    score={scoreA.total}
                    isWinner={battleResult.winner === "A"}
                    color="#3b82f6"
                  />
                  <div className="text-2xl font-black text-gray-300 dark:text-gray-600">
                    VS
                  </div>
                  <ScoreRing
                    username={userB?.username}
                    score={scoreB.total}
                    isWinner={battleResult.winner === "B"}
                    color="#a855f7"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Highlights */}
        <AnimatePresence>
          {revealStage >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white dark:bg-gray-900 rounded-[20px] border border-gray-200 dark:border-gray-800 p-8 md:p-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-heading-lg font-bold text-gray-900 dark:text-white">
                    Profile Highlights
                  </h3>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Signals: repos, stars, commits, consistency, impact, docs
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

        {/* Head-to-Head Metrics */}
        <AnimatePresence>
          {revealStage >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white dark:bg-gray-900 rounded-[20px] border border-gray-200 dark:border-gray-800 p-8 md:p-10">
                <h3 className="text-heading-lg font-bold text-gray-900 dark:text-white text-center mb-8">
                  Head-to-Head
                </h3>
                <div className="space-y-6">
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
                        transition={{ delay: 0.5 + i * 0.12 }}
                      >
                        <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 text-center mb-2">
                          {m.label}
                        </div>
                        <div className="flex items-center gap-3">
                          {/* User A value */}
                          <span
                            className={`w-16 text-right font-bold text-lg ${winnerSide === "A" ? "text-blue-500" : "text-gray-400 dark:text-gray-500"}`}
                          >
                            <CountUp
                              end={m.valueA}
                              duration={1.2}
                              separator=","
                            />
                          </span>
                          {/* User A bar */}
                          <div className="flex-1 flex justify-end">
                            <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-blue-500 rounded-full float-right"
                                initial={{ width: 0 }}
                                animate={{ width: `${pctA}%` }}
                                transition={{
                                  duration: 0.8,
                                  delay: 0.6 + i * 0.12,
                                }}
                              />
                            </div>
                          </div>
                          {/* Divider */}
                          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
                          {/* User B bar */}
                          <div className="flex-1">
                            <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-purple-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${pctB}%` }}
                                transition={{
                                  duration: 0.8,
                                  delay: 0.6 + i * 0.12,
                                }}
                              />
                            </div>
                          </div>
                          {/* User B value */}
                          <span
                            className={`w-16 text-left font-bold text-lg ${winnerSide === "B" ? "text-purple-500" : "text-gray-400 dark:text-gray-500"}`}
                          >
                            <CountUp
                              end={m.valueB}
                              duration={1.2}
                              separator=","
                            />
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                  {/* Legend */}
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 pt-2">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-blue-500 rounded-full" />@
                      {userA?.username}
                    </span>
                    <span className="flex items-center gap-2">
                      @{userB?.username}
                      <span className="w-3 h-3 bg-purple-500 rounded-full" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tech Stack Venn */}
        <AnimatePresence>
          {revealStage >= 1 && (langsA.size > 0 || langsB.size > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-white dark:bg-gray-900 rounded-[20px] border border-gray-200 dark:border-gray-800 p-8 md:p-10">
                <h3 className="text-heading-lg font-bold text-gray-900 dark:text-white text-center mb-8">
                  Tech Stack Overlap
                </h3>
                <div className="flex items-center justify-center gap-0 relative h-56">
                  {/* Circle A */}
                  <motion.div
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-48 h-48 rounded-full bg-blue-500/15 dark:bg-blue-500/10 border-2 border-blue-400/30 flex items-center justify-center relative -mr-12"
                  >
                    <div className="text-center pr-8">
                      <div className="text-3xl font-black text-blue-500">
                        {uniqueA.length}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        unique
                      </div>
                    </div>
                  </motion.div>
                  {/* Shared count */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="absolute z-10 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg"
                  >
                    <div className="text-lg font-black text-gray-900 dark:text-white">
                      {shared.length}
                    </div>
                    <div className="text-[9px] text-gray-500">shared</div>
                  </motion.div>
                  {/* Circle B */}
                  <motion.div
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-48 h-48 rounded-full bg-purple-500/15 dark:bg-purple-500/10 border-2 border-purple-400/30 flex items-center justify-center relative -ml-12"
                  >
                    <div className="text-center pl-8">
                      <div className="text-3xl font-black text-purple-500">
                        {uniqueB.length}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        unique
                      </div>
                    </div>
                  </motion.div>
                </div>
                {/* Labels */}
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-4 px-8">
                  <span>@{userA?.username}</span>
                  <span>@{userB?.username}</span>
                </div>
                {/* Shared languages list */}
                {shared.length > 0 && (
                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Shared: {shared.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Winner Announcement */}
        <AnimatePresence>
          {revealStage >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
            >
              {battleResult.winner === "TIE" ? (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-[20px] p-12 text-center">
                  <span className="text-6xl mb-4 block">🤝</span>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                    It's a Draw!
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Both developers are evenly matched.
                  </p>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-900/10 dark:via-amber-900/10 dark:to-orange-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-[20px] p-10 md:p-12 text-center relative overflow-hidden">
                  {/* Confetti */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{
                          y: -10,
                          x: `${Math.random() * 100}%`,
                          opacity: 0,
                        }}
                        animate={{
                          y: 500,
                          opacity: [0, 1, 0],
                          rotate: Math.random() * 360,
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          delay: Math.random(),
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                        className="absolute text-lg"
                      >
                        {["🎉", "⭐", "✨", "💫"][i % 4]}
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                  >
                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  </motion.div>

                  <img
                    src={`https://github.com/${battleResult.winner === "A" ? userA?.username : userB?.username}.png`}
                    alt="Winner"
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white dark:border-gray-800 shadow-xl"
                  />

                  <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                    {battleResult.winner === "A"
                      ? userA?.profile?.name || userA?.username
                      : userB?.profile?.name || userB?.username}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    {battleResult.description}
                  </p>
                  <div className="inline-flex items-center gap-4 bg-white dark:bg-gray-800 px-8 py-4 rounded-2xl shadow-md">
                    <span className="text-2xl font-black text-yellow-600">
                      {battleResult.winner === "A"
                        ? scoreA.total
                        : scoreB.total}
                    </span>
                    <span className="text-gray-400 font-bold">vs</span>
                    <span className="text-2xl font-black text-gray-400">
                      {battleResult.winner === "A"
                        ? scoreB.total
                        : scoreA.total}
                    </span>
                  </div>
                </div>
              )}
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
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {isWinner && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: -8 }}
            transition={{ delay: 0.8 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 z-10"
          >
            <Crown className="w-7 h-7 text-yellow-500 fill-yellow-400" />
          </motion.div>
        )}
        <svg width="140" height="140" className="-rotate-90">
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
            className="w-12 h-12 rounded-full mb-1"
          />
          <span className="text-2xl font-black text-gray-900 dark:text-white">
            <CountUp end={score} duration={1.5} />
          </span>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
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
      ? "border-purple-200 dark:border-purple-800/40"
      : "border-blue-200 dark:border-blue-800/40";

  const dotClass = accent === "purple" ? "bg-purple-500" : "bg-blue-500";

  return (
    <div
      className={`rounded-2xl border ${accentClasses} p-6 bg-gray-50 dark:bg-gray-800/50`}
    >
      <div className="flex items-center gap-4 mb-5">
        <img
          src={avatar}
          alt={username}
          className="w-12 h-12 rounded-full border border-white dark:border-gray-800"
        />
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${dotClass}`} />
            <span className="font-semibold text-gray-900 dark:text-white">
              {title}
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            @{username}
          </div>
        </div>
        <span className={`ml-auto w-2.5 h-2.5 rounded-full ${dotClass}`} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <StatItem key={stat.label} stat={stat} />
        ))}
      </div>
    </div>
  );
}

function StatItem({ stat }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
        {stat.label}
      </div>
      <div className="text-sm font-semibold text-gray-900 dark:text-white">
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
