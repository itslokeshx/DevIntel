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
  MapPin,
  Trophy,
  ExternalLink,
  Copy,
  Check,
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
  const [linkCopied, setLinkCopied] = useState(false);

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
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-12 py-12">
          <div className="text-center mb-12">
            <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[var(--text-secondary)]">
              Analyzing @{username}'s developer DNA...
            </p>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
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
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* ═══ STICKY SUBHEADER ═══ */}
      <div className="sticky top-14 z-[999] h-12 glass border-b border-[var(--border-subtle)]">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-12 h-full flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-lg transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <span className="text-[13px] font-medium text-[var(--text-primary)] truncate max-w-[140px] sm:max-w-none">
            @{username}
          </span>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-lg border border-[var(--border-default)] transition-all disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">
              {refreshing ? "Refreshing..." : "Refresh"}
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        {/* ═══ PROFILE HERO ═══ */}
        <div className="mb-8">
          <div className="relative rounded-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-6 sm:p-10 md:p-12 overflow-hidden">
            {/* Subtle dot pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />
            </div>

            <div className="relative flex flex-col items-center text-center gap-5">
              {/* Avatar */}
              <img
                src={data.profile?.avatarUrl}
                alt={username}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[var(--border-default)] shadow-sm"
              />

              {/* Name */}
              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[var(--text-primary)] tracking-[-0.02em]">
                  {data.profile?.name || username}
                </h1>
                <p className="text-sm text-[var(--text-tertiary)] font-medium">
                  @{username}
                </p>
              </div>

              {/* Tech identity */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-tertiary)] rounded-full border border-[var(--border-default)]">
                {data.metrics?.primaryTechIdentity || "Developer"}
              </div>

              {/* Bio */}
              {data.profile?.bio && (
                <p className="text-sm text-[var(--text-secondary)] max-w-lg leading-relaxed">
                  {data.profile.bio}
                </p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--text-tertiary)]">
                {data.profile?.location && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-[var(--bg-tertiary)] rounded-md">
                    <MapPin className="w-3 h-3" />
                    <span>{data.profile.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 px-2 py-1 bg-[var(--bg-tertiary)] rounded-md">
                  <Users className="w-3 h-3" />
                  <span>
                    <strong className="text-[var(--text-primary)] font-medium">
                      {data.profile?.followers || 0}
                    </strong>{" "}
                    followers
                  </span>
                </div>
                {data.profile?.createdAt && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-[var(--bg-tertiary)] rounded-md">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Joined {new Date(data.profile.createdAt).getFullYear()}
                    </span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 pt-2 text-center">
                <div>
                  <div className="text-lg sm:text-xl font-semibold text-[var(--text-primary)]">
                    {repos.length}
                  </div>
                  <div className="text-[11px] text-[var(--text-tertiary)]">Repos</div>
                </div>
                <div className="w-px h-8 bg-[var(--border-default)]" />
                <div>
                  <div className="text-lg sm:text-xl font-semibold text-[var(--text-primary)]">
                    {totalStars}
                  </div>
                  <div className="text-[11px] text-[var(--text-tertiary)]">Stars</div>
                </div>
                <div className="w-px h-8 bg-[var(--border-default)]" />
                <div>
                  <div className="text-lg sm:text-xl font-semibold text-[var(--text-primary)]">
                    {totalCommits.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[var(--text-tertiary)]">Commits</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ AI VERDICT ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 sm:p-7 overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-base">🧬</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                    AI Analysis
                  </h2>
                  {aiVerdictStreaming && (
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  )}
                </div>
                <div className="text-[13px] leading-relaxed text-[var(--text-secondary)]">
                  {aiVerdictStreaming ? (
                    <div>
                      <span>{aiVerdict}</span>
                      <span className="inline-block w-0.5 h-4 bg-[var(--accent)] ml-0.5 align-middle animate-pulse" />
                    </div>
                  ) : aiVerdict ? (
                    aiVerdict
                  ) : (
                    <p className="text-[var(--text-tertiary)]">
                      Generating AI analysis...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ STAT CARDS ═══ */}
        <div className="mb-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              label="Repositories"
              value={repos.length}
              percentile={data.aiInsights?.gamification?.percentiles?.projects || 75}
            />
            <StatCard
              label="Total Stars"
              value={totalStars}
              percentile={data.aiInsights?.gamification?.percentiles?.stars || 68}
            />
            <StatCard
              label="Total Commits"
              value={totalCommits}
              percentile={data.aiInsights?.gamification?.percentiles?.commits || 82}
            />
            <StatCard
              label="Current Streak"
              value={data.contributions?.currentStreak || 0}
              percentile={data.aiInsights?.gamification?.percentiles?.streak || 55}
              suffix=" days"
            />
          </div>
        </div>

        {/* ═══ CONTRIBUTION HEATMAP ═══ */}
        {data.contributions && (
          <div className="mb-10">
            <ContributionHeatmap contributions={data.contributions} />
          </div>
        )}

        {/* ═══ TECH STACK DNA ═══ */}
        {data.metrics?.languageStats &&
          data.metrics.languageStats.length > 0 && (
            <div className="mb-10">
              <TechStackDNA
                languageStats={data.metrics.languageStats}
                repositories={data.repositories}
              />
            </div>
          )}

        {/* ═══ REPOSITORY SHOWCASE ═══ */}
        {repos.length > 0 && (
          <div className="mb-10">
            <RepositoryShowcase repositories={data.repositories} />
          </div>
        )}

        {/* ═══ YEARLY BREAKDOWN ═══ */}
        {data.yearlyBreakdown && data.yearlyBreakdown.length > 0 && (
          <div className="mb-10">
            <YearlyBreakdown
              yearlyBreakdown={data.yearlyBreakdown}
              contributions={data.contributions}
            />
          </div>
        )}

        {/* ═══ DEVELOPER ANALYSIS ═══ */}
        {data.metrics && (
          <div className="mb-10">
            <DeveloperAnalysis
              metrics={data.metrics}
              contributions={data.contributions}
              repositories={data.repositories}
            />
          </div>
        )}

        {/* ═══ DEVELOPER WRAPPED ═══ */}
        <div className="mb-10">
          <DeveloperWrapped
            wrappedData={data.wrappedData}
            contributions={data.contributions}
            repositories={data.repositories}
            username={username}
          />
        </div>

        {/* ═══ ACTIONS ═══ */}
        <div className="space-y-4 mb-10">
          {/* Compare CTA */}
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    Battle Arena
                  </h3>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Compare profiles with AI-powered analysis
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/compare")}
                className="px-4 py-2 text-xs font-medium bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg hover:opacity-90 transition-opacity"
              >
                Challenge a Developer →
              </button>
            </div>
          </div>

          {/* Share & Discover */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-md bg-[var(--bg-tertiary)] flex items-center justify-center text-sm">
                  🔗
                </div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                  Share Profile
                </h4>
              </div>
              <p className="text-xs text-[var(--text-tertiary)] mb-3">
                Share your developer insights with the world.
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setLinkCopied(true);
                  setTimeout(() => setLinkCopied(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-tertiary)] hover:bg-[var(--surface-hover)] rounded-lg border border-[var(--border-default)] transition-colors"
              >
                {linkCopied ? (
                  <>
                    <Check className="w-3 h-3 text-green-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-md bg-[var(--bg-tertiary)] flex items-center justify-center text-sm">
                  🔍
                </div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                  Discover More
                </h4>
              </div>
              <p className="text-xs text-[var(--text-tertiary)] mb-3">
                Analyze any GitHub developer's profile.
              </p>
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-tertiary)] hover:bg-[var(--surface-hover)] rounded-lg border border-[var(--border-default)] transition-colors"
              >
                <Star className="w-3 h-3" />
                <span>Analyze Another</span>
              </button>
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

/* ═══ STAT CARD ═══ */
function StatCard({ label, value, percentile, suffix = "" }) {
  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 sm:p-5">
      <div className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] tracking-tight mb-1">
        <CountUp end={value} duration={1} separator="," />
        {suffix && <span className="text-sm text-[var(--text-tertiary)] font-normal">{suffix}</span>}
      </div>
      <div className="text-[11px] font-medium text-[var(--text-tertiary)] mb-3">
        {label}
      </div>
      <div className="h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] rounded-full transition-all duration-1000"
          style={{ width: `${percentile || 50}%`, opacity: 0.7 }}
        />
      </div>
      <div className="text-[10px] text-[var(--text-tertiary)] mt-1.5">
        Top {100 - (percentile || 50)}%
      </div>
    </div>
  );
}
