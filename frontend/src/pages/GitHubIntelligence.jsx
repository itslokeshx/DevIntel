import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  ArrowLeft,
  RefreshCw,
  Star,
  Code2,
  Users,
  Calendar,
  Flame,
  GitCommit,
  MapPin,
} from "lucide-react";
import { githubAPI } from "../services/api";
import useStore from "../store";
import { ContributionHeatmap } from "../components/github/ContributionHeatmap";
import { TechStackDNA } from "../components/github/TechStackDNA";
import { YearlyBreakdown } from "../components/github/YearlyBreakdown";
import { DeveloperWrapped } from "../components/github/DeveloperWrapped";
import { RepositoryShowcase } from "../components/github/RepositoryShowcase";
import { GrowthOpportunities } from "../components/github/GrowthOpportunities";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { AllRepositories } from "../components/github/AllRepositories";
import { DeveloperAnalysis } from "../components/github/DeveloperAnalysis";

export default function GitHubIntelligence() {
  const { username } = useParams();
  const navigate = useNavigate();
  const {
    profile,
    loading,
    error,
    aiVerdict,
    aiVerdictStreaming,
    fetchProfile,
    streamAIVerdict,
  } = useStore();
  const [localData, setLocalData] = useState(null);
  const [showAllRepos, setShowAllRepos] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (username) {
      fetchData();
    }
  }, [username]);

  async function fetchData() {
    try {
      setLocalData(null);
      const response = await githubAPI.analyze(username);
      const data = response.data || response;
      setLocalData(data);
      useStore.getState().setProfile(data);
      if (data) {
        streamAIVerdict(username, data);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }

  const data = localData || profile;

  if (!data) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="max-w-content mx-auto px-6 lg:px-12 py-12">
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            />
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Analyzing @{username}'s developer DNA...
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              This may take a few moments
            </p>
          </div>
          <div className="space-y-8">
            <LoadingSkeleton type="profile" />
            <LoadingSkeleton type="card" count={2} />
            <LoadingSkeleton type="heatmap" />
          </div>
        </div>
      </div>
    );
  }

  const repos = data.repositories || [];
  const totalStars = repos.reduce((sum, r) => sum + (r.stars || 0), 0);
  const totalCommits = data.contributions?.totalCommits || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ═══ PROFILE HEADER BAR ═══ */}
      <div className="sticky top-[72px] z-[999] h-16 glass border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-content mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <span className="text-base font-semibold text-gray-900 dark:text-white">
            @{username}
          </span>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:text-blue-500 hover:border-blue-500 rounded-lg border border-gray-200 dark:border-gray-700 transition-all disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 lg:px-12 py-12">
        {/* ═══ HERO CARD ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-12 shadow-md">
            <div className="flex flex-col md:flex-row items-start gap-10">
              {/* Avatar with glow */}
              <motion.div
                className="relative flex-shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
              >
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-xl animate-pulse-slow" />
                <img
                  src={data.profile?.avatarUrl}
                  alt={username}
                  className="relative w-40 h-40 rounded-full border-4 border-white dark:border-gray-900 shadow-xl"
                />
                {/* Archetype Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap shadow-blue"
                >
                  🏗️ {data.metrics?.primaryTechIdentity || "Developer"}
                </motion.div>
              </motion.div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-display-md md:text-[48px] font-extrabold text-gray-900 dark:text-white leading-[1.1] mb-2"
                >
                  {data.profile?.name || username}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-heading-md text-gray-500 dark:text-gray-400 font-medium mb-6"
                >
                  @{username}
                </motion.p>

                {data.profile?.bio && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-body-lg text-gray-600 dark:text-gray-300 max-w-[700px] leading-relaxed mb-8"
                  >
                    {data.profile.bio}
                  </motion.p>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap items-center gap-8 text-[15px] text-gray-500 dark:text-gray-400"
                >
                  {data.profile?.location && (
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {data.profile.location}
                    </span>
                  )}
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <strong className="text-gray-900 dark:text-white">
                      {data.profile?.followers || 0}
                    </strong>{" "}
                    followers
                  </span>
                  {data.profile?.createdAt && (
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(data.profile.createdAt).getFullYear()}
                    </span>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ AI VERDICT CARD ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <div
            className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-2 border-blue-200 dark:border-blue-800/50 rounded-[20px] p-10 overflow-hidden animate-gradient"
            style={{ backgroundSize: "200% 200%" }}
          >
            <div className="flex items-start gap-5">
              <span className="text-5xl flex-shrink-0 mt-1">🧬</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-heading-md font-bold text-gray-900 dark:text-white">
                    AI Verdict
                  </h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Powered by Llama 3.3 70B
                </p>
                <div className="text-[19px] md:text-body-lg leading-[1.7] text-gray-800 dark:text-gray-200 tracking-[0.01em]">
                  {aiVerdictStreaming ? (
                    <div>
                      <span>{aiVerdict}</span>
                      <span className="inline-block w-0.5 h-5 bg-blue-500 ml-1 align-middle animate-pulse" />
                    </div>
                  ) : aiVerdict ? (
                    aiVerdict
                  ) : (
                    <p className="text-gray-400 dark:text-gray-500">
                      Generating AI analysis...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ STAT CARDS GRID ═══ */}
        <div className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon="📁"
              gradient="from-blue-500 to-blue-600"
              value={repos.length}
              label="Repositories"
              percentile={
                data.aiInsights?.gamification?.percentiles?.projects || 75
              }
              delay={0}
            />
            <StatCard
              icon="⭐"
              gradient="from-purple-500 to-purple-700"
              value={totalStars}
              label="Total Stars"
              percentile={
                data.aiInsights?.gamification?.percentiles?.stars || 68
              }
              delay={0.1}
            />
            <StatCard
              icon="💻"
              gradient="from-green-500 to-green-600"
              value={totalCommits}
              label="Total Commits"
              percentile={
                data.aiInsights?.gamification?.percentiles?.commits || 82
              }
              delay={0.2}
            />
            <StatCard
              icon="🔥"
              gradient="from-orange-400 to-orange-600"
              value={data.contributions?.currentStreak || 0}
              label="Current Streak"
              percentile={
                data.aiInsights?.gamification?.percentiles?.streak || 55
              }
              delay={0.3}
            />
          </div>
        </div>

        {/* ═══ CONTRIBUTION HEATMAP ═══ */}
        {data.contributions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <ContributionHeatmap contributions={data.contributions} />
          </motion.div>
        )}

        {/* ═══ TECH STACK DNA ═══ */}
        {data.metrics?.languageStats &&
          data.metrics.languageStats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-12"
            >
              <TechStackDNA
                languageStats={data.metrics.languageStats}
                repositories={data.repositories}
              />
            </motion.div>
          )}

        {/* ═══ REPOSITORY SHOWCASE ═══ */}
        {repos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-12"
          >
            <RepositoryShowcase repositories={data.repositories} />
          </motion.div>
        )}

        {/* ═══ YEARLY BREAKDOWN ═══ */}
        {data.yearlyBreakdown && data.yearlyBreakdown.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-12"
          >
            <YearlyBreakdown
              yearlyBreakdown={data.yearlyBreakdown}
              contributions={data.contributions}
            />
          </motion.div>
        )}

        {/* ═══ DEVELOPER ANALYSIS ═══ */}
        {data.metrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-12"
          >
            <DeveloperAnalysis
              metrics={data.metrics}
              contributions={data.contributions}
              repositories={data.repositories}
            />
          </motion.div>
        )}

        {/* ═══ DEVELOPER WRAPPED ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-12"
        >
          <DeveloperWrapped
            wrappedData={data.wrappedData}
            contributions={data.contributions}
            repositories={data.repositories}
            username={username}
          />
        </motion.div>

        {/* ═══ GROWTH OPPORTUNITIES ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mb-20"
        >
          <GrowthOpportunities
            growthOps={data.insights?.growthOps}
            metrics={data.metrics}
            repositories={data.repositories}
          />
        </motion.div>
      </div>

      {/* All Repositories Modal */}
      {showAllRepos && (
        <AllRepositories
          repositories={repos}
          onClose={() => setShowAllRepos(false)}
        />
      )}
    </div>
  );
}

/* ═══ STAT CARD COMPONENT ═══ */
function StatCard({ icon, gradient, value, label, percentile, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group"
    >
      {/* Icon badge */}
      <div
        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 shadow-md`}
      >
        <span className="text-[28px]">{icon}</span>
      </div>

      {/* Big number */}
      <div className="text-[52px] lg:text-[44px] xl:text-[52px] font-extrabold text-gray-900 dark:text-white leading-none mb-2">
        <CountUp end={value} duration={1.5} separator="," />
      </div>

      {/* Label */}
      <div className="text-[15px] font-medium text-gray-500 dark:text-gray-400 mb-5">
        {label}
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 dark:bg-gray-800 mb-5" />

      {/* Percentile */}
      <div className="flex items-center justify-between text-sm mb-3">
        <span className="text-gray-500 dark:text-gray-400">
          Top {100 - (percentile || 50)}% globally
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentile || 50}%` }}
          transition={{
            duration: 1.5,
            delay: (delay || 0) + 0.5,
            ease: "easeOut",
          }}
        />
      </div>
    </motion.div>
  );
}

function SectionCard({ icon, title, children }) {
  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        {icon}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function GrowthCard({ number, title, description, action }) {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
      <div className="flex items-start gap-4">
        <span className="text-2xl">{number}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-3">{description}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            <span className="font-semibold">Tip:</span> {action}
          </p>
        </div>
      </div>
    </div>
  );
}
