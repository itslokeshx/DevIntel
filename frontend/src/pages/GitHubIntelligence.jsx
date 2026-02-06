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
  Trophy,
} from "lucide-react";
import { githubAPI } from "../services/api";
import useStore from "../store";
import { ContributionHeatmap } from "../components/github/ContributionHeatmap";
import { TechStackDNA } from "../components/github/TechStackDNA";
import { YearlyBreakdown } from "../components/github/YearlyBreakdown";
import { DeveloperWrapped } from "../components/github/DeveloperWrapped";
import { RepositoryShowcase } from "../components/github/RepositoryShowcase";
import { DeveloperSignature } from "../components/github/DeveloperSignature";
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
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-12 py-12">
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
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-12 h-full flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate max-w-[120px] sm:max-w-none">
            @{username}
          </span>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:text-blue-500 hover:border-blue-500 rounded-lg border border-gray-200 dark:border-gray-700 transition-all disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">
              {refreshing ? "Refreshing..." : "Refresh"}
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        {/* ═══ HERO CARD ═══ */}
        <div className="mb-6 sm:mb-8">
          <div className="relative bg-gradient-to-br from-white via-gray-50/30 to-white dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-10 md:p-14 shadow-sm overflow-hidden">
            {/* Subtle decorative pattern */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
                  backgroundSize: "48px 48px",
                }}
              />
            </div>

            <div className="relative flex flex-col items-center text-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl" />
                <img
                  src={data.profile?.avatarUrl}
                  alt={username}
                  className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                />
              </div>

              {/* Name and Title */}
              <div className="space-y-3">
                <div>
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                    {data.profile?.name || username}
                  </h1>
                  <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
                    @{username}
                  </p>
                </div>

                {/* Tech Identity Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold border border-blue-200/50 dark:border-blue-800/50">
                  <span className="text-base">💼</span>
                  {data.metrics?.primaryTechIdentity || "Developer"}
                </div>
              </div>

              {/* Bio */}
              {data.profile?.bio && (
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                  {data.profile.bio}
                </p>
              )}

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {data.profile?.location && (
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{data.profile.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>
                    <strong className="text-gray-900 dark:text-white font-semibold">
                      {data.profile?.followers || 0}
                    </strong>{" "}
                    followers ·{" "}
                    <strong className="text-gray-900 dark:text-white font-semibold">
                      {data.profile?.following || 0}
                    </strong>{" "}
                    following
                  </span>
                </div>
                {data.profile?.createdAt && (
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>
                      Joined {new Date(data.profile.createdAt).getFullYear()}
                    </span>
                  </div>
                )}
              </div>

              {/* Developer Stats Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm font-medium border border-blue-200 dark:border-blue-800/50">
                  {repos.length} Repositories
                </div>
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 rounded-full text-xs sm:text-sm font-medium border border-purple-200 dark:border-purple-800/50">
                  {totalStars} Stars Earned
                </div>
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 rounded-full text-xs sm:text-sm font-medium border border-green-200 dark:border-green-800/50">
                  {totalCommits.toLocaleString()} Commits
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ AI VERDICT CARD ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 sm:mb-10"
        >
          <div
            className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-2 border-blue-200 dark:border-blue-800/50 rounded-2xl sm:rounded-[20px] p-4 sm:p-8 md:p-10 overflow-hidden animate-gradient"
            style={{ backgroundSize: "200% 200%" }}
          >
            <div className="flex items-start gap-3 sm:gap-5">
              <span className="text-2xl sm:text-5xl flex-shrink-0 mt-1">
                🧬
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 sm:mb-2">
                  <h2 className="text-lg sm:text-heading-md font-bold text-gray-900 dark:text-white">
                    What Makes You Special?
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
                  AI-powered insights revealing your unique developer DNA
                </p>
                <div className="text-base sm:text-[19px] md:text-body-lg leading-[1.7] text-gray-800 dark:text-gray-200 tracking-[0.01em]">
                  {aiVerdictStreaming ? (
                    <div>
                      <span>{aiVerdict}</span>
                      <span className="inline-block w-0.5 h-5 bg-blue-500 ml-1 align-middle opacity-70" />
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
          <div className="mb-12">
            <ContributionHeatmap contributions={data.contributions} />
          </div>
        )}

        {/* ═══ TECH STACK DNA ═══ */}
        {data.metrics?.languageStats &&
          data.metrics.languageStats.length > 0 && (
            <div className="mb-12">
              <TechStackDNA
                languageStats={data.metrics.languageStats}
                repositories={data.repositories}
              />
            </div>
          )}

        {/* ═══ REPOSITORY SHOWCASE ═══ */}
        {repos.length > 0 && (
          <div className="mb-12">
            <RepositoryShowcase repositories={data.repositories} />
          </div>
        )}

        {/* ═══ YEARLY BREAKDOWN ═══ */}
        {data.yearlyBreakdown && data.yearlyBreakdown.length > 0 && (
          <div className="mb-12">
            <YearlyBreakdown
              yearlyBreakdown={data.yearlyBreakdown}
              contributions={data.contributions}
            />
          </div>
        )}

        {/* ═══ DEVELOPER ANALYSIS ═══ */}
        {data.metrics && (
          <div className="mb-12">
            <DeveloperAnalysis
              metrics={data.metrics}
              contributions={data.contributions}
              repositories={data.repositories}
            />
          </div>
        )}

        {/* ═══ DEVELOPER WRAPPED ═══ */}
        <div className="mb-12">
          <DeveloperWrapped
            wrappedData={data.wrappedData}
            contributions={data.contributions}
            repositories={data.repositories}
            username={username}
          />
        </div>

        {/* ═══ ENGAGEMENT SECTION ═══ */}
        <div className="space-y-8 mb-20">
          {/* Compare CTA */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-blue-200 dark:border-blue-800/50">
            <div className="relative z-10 text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Battle Arena
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Ready to Battle?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                Compare your developer profile against others. See who comes out
                on top with AI-powered analysis.
              </p>
              <button
                onClick={() => navigate("/compare")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <span>Challenge a Developer</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>

          {/* Share Profile CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                  Share Your Profile
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Show off your developer achievements and AI-generated insights
                  with the world.
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Profile link copied to clipboard!");
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
                >
                  <span>Copy Profile Link</span>
                  <Code2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                  Discover More Devs
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Analyze any GitHub developer's profile and uncover hidden
                  patterns in their code.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
                >
                  <span>Analyze Another</span>
                  <Star className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="text-center py-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>AI-Powered Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Real-time GitHub Data</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Developer Insights</span>
              </div>
            </div>
          </div>
        </div>
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
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 sm:p-8 transition-shadow duration-200 hover:shadow-md">
      {/* Icon badge */}
      <div
        className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 sm:mb-5`}
      >
        <span className="text-xl sm:text-[28px]">{icon}</span>
      </div>

      {/* Big number */}
      <div className="text-3xl sm:text-[44px] xl:text-[52px] font-bold text-gray-900 dark:text-white leading-none mb-2">
        <CountUp end={value} duration={1} separator="," />
      </div>

      {/* Label */}
      <div className="text-xs sm:text-[15px] font-medium text-gray-500 dark:text-gray-400 mb-3 sm:mb-5">
        {label}
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 dark:bg-gray-800 mb-3 sm:mb-5" />

      {/* Percentile */}
      <div className="flex items-center justify-between text-sm mb-3">
        <span className="text-gray-500 dark:text-gray-400">
          Top {100 - (percentile || 50)}% globally
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-1000`}
          style={{ width: `${percentile || 50}%` }}
        />
      </div>
    </div>
  );
}

function SectionCard({ icon, title, children }) {
  return (
    <div className="p-4 sm:p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        {icon}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function GrowthCard({ number, title, description, action }) {
  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
      <div className="flex items-start gap-3 sm:gap-4">
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
