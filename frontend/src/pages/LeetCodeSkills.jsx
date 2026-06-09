import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Code, BrainCircuit } from "lucide-react";
import { leetCodeAPI } from "../services/api";
import { StatsOverview } from "../components/leetcode/StatsOverview";
import { SubmissionHeatmap } from "../components/leetcode/SubmissionHeatmap";
import { RecentSubmissions } from "../components/leetcode/RecentSubmissions";

export default function LeetCodeSkills() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (username) {
      fetchData();
    }
  }, [username]);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      // Try fetch first, if 404 then analyze
      try {
        const response = await leetCodeAPI.getUser(username);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        if (err.message.includes("No data found")) {
          console.log("No cached data, analyzing user...");
          const analyzeResponse = await leetCodeAPI.analyze(username);
          setData(analyzeResponse.data);
          setLoading(false);
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.error("Error fetching LeetCode data:", err);
      setError(err.message || "Failed to fetch LeetCode data");
      setLoading(false);
    }
  }

  async function handleRefresh() {
    try {
      setLoading(true);
      setError(null);
      const response = await leetCodeAPI.analyze(username);
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to refresh data");
      setLoading(false);
    }
  }

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <div className="max-w-content mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-[var(--text-tertiary)]">
            Analyzing LeetCode skills...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 bg-[var(--bg-elevated)] border border-red-500/20 rounded-xl text-center">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 text-xs font-medium bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg hover:opacity-90 transition-opacity"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Sticky Subheader */}
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
            LeetCode: @{data?.username || username}
          </span>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-lg border border-[var(--border-default)] transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        {/* AI Insight Hero */}
        {data?.aiInsights && (
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 sm:p-7 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.02]">
              <BrainCircuit className="w-20 h-20 sm:w-28 sm:h-28" />
            </div>
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-1 bg-[var(--accent-muted)] text-[var(--accent)] text-[10px] font-semibold rounded-full uppercase tracking-wider">
                  AI Verdict
                </span>
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                  {data.aiInsights.developerType}
                </h2>
              </div>
              <p className="text-[15px] text-[var(--text-secondary)] font-medium mb-4 leading-relaxed">
                {data.aiInsights.verdict}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-[var(--border-subtle)]">
                <div>
                  <h3 className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                    Strengths
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {data.aiInsights.strengths.map((str, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-[var(--bg-tertiary)] rounded-md text-xs font-medium text-[var(--text-primary)] border border-[var(--border-subtle)]"
                      >
                        {str}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                    Focus Area
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {data.aiInsights.recommendedFocus}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column: Stats & Badges */}
          <div className="lg:col-span-2 space-y-8">
            <StatsOverview
              profile={data?.profile}
              stats={data?.stats}
              badges={data?.badges}
            />
            <SubmissionHeatmap calendar={data?.submissionCalendar} />
          </div>

          {/* Right Column: Recent Activity */}
          <div className="lg:col-span-1">
            <RecentSubmissions submissions={data?.recentSubmissions} />
          </div>
        </div>
      </div>
    </div>
  );
}
