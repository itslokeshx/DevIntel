import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Code, BrainCircuit } from "lucide-react";
import { leetCodeAPI } from "../services/api";
import { Button } from "../components/common/Button";
import { Loading } from "../components/common/Loading";
import { Card } from "../components/common/Card";
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
      <div className="min-h-screen bg-background-light dark:bg-background-dark py-12">
        <Loading text="Analyzing LeetCode skills..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark py-12 flex justify-center">
        <div className="max-w-md w-full p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center">
          <p className="text-red-800 dark:text-red-200 mb-4">{error}</p>
          <Button onClick={() => navigate("/")}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-6 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div className="flex items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-light-text-primary dark:text-dark-text-primary">
              <Code className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              <span className="hidden sm:inline">LeetCode Intelligence:</span>
              <span className="text-orange-600 dark:text-orange-400">
                {data?.username || username}
              </span>
            </h1>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />{" "}
            Refresh
          </Button>
        </div>

        {/* AI Insight Hero */}
        {data?.aiInsights && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-100 dark:border-orange-800 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BrainCircuit className="w-20 h-20 sm:w-32 sm:h-32" />
            </div>
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 text-[10px] sm:text-xs font-bold rounded uppercase tracking-wide">
                  AI Verdict
                </span>
                <h2 className="text-base sm:text-lg font-bold text-orange-900 dark:text-orange-100">
                  {data.aiInsights.developerType}
                </h2>
              </div>
              <p className="text-base sm:text-lg text-orange-900 dark:text-orange-100 font-medium mb-3 sm:mb-4">
                {data.aiInsights.verdict}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-bold text-orange-800 dark:text-orange-300 uppercase mb-1">
                    Strengths
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.aiInsights.strengths.map((str, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-white/50 dark:bg-black/20 rounded text-sm text-orange-900 dark:text-orange-100"
                      >
                        {str}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-orange-800 dark:text-orange-300 uppercase mb-1">
                    Focus Area
                  </h3>
                  <p className="text-sm text-orange-900 dark:text-orange-100">
                    {data.aiInsights.recommendedFocus}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
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
