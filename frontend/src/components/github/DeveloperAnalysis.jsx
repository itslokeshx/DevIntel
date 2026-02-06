import React from "react";
import { motion } from "framer-motion";
import { Clock, Target, GitBranch, Zap, Award } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

export function DeveloperAnalysis({ metrics, contributions, repositories }) {
  if (!metrics) return null;

  const radarData = [
    {
      metric: "Consistency",
      value: metrics.consistencyScore || 0,
      fullMark: 100,
    },
    { metric: "Impact", value: metrics.impactScore || 0, fullMark: 100 },
    { metric: "Quality", value: metrics.qualityScore || 0, fullMark: 100 },
    {
      metric: "Activity",
      value: Math.min((contributions?.totalCommits || 0) / 10, 100),
      fullMark: 100,
    },
    {
      metric: "Community",
      value: Math.min(
        (repositories?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0) / 5,
        100,
      ),
      fullMark: 100,
    },
  ];

  const activityPattern = metrics.activityPattern || "consistent";
  const projectFocus = metrics.projectFocus || "balanced";
  const devScore = metrics.devScore || 0;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-900/50 rounded-2xl sm:rounded-[24px] border border-gray-200 dark:border-gray-800 p-4 sm:p-8 md:p-10 shadow-lg">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 flex items-center gap-3">
        <span className="text-2xl sm:text-3xl">📊</span>
        Developer Analysis
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        {/* Radar Chart */}
        <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200 mb-3 text-center">
            Skills Pentagon
          </h4>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid
                stroke="#e5e7eb"
                strokeDasharray="3 3"
                className="dark:stroke-gray-700"
              />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "#6b7280", fontSize: 11, fontWeight: 600 }}
                className="dark:fill-gray-400"
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke="#6366f1"
                fill="url(#radarGradient)"
                fillOpacity={0.4}
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Dev Score Card */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -mr-14 -mt-14" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-5">
              <Award className="w-5 h-5" />
              <h4 className="text-base sm:text-lg font-bold">
                Developer Score
              </h4>
            </div>

            <div className="flex items-end gap-2 mb-3">
              <div className="text-5xl sm:text-6xl font-extrabold">
                {devScore}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white/70 mb-1">
                /100
              </div>
            </div>

            <div className="mb-5">
              <div className="text-lg sm:text-xl font-semibold mb-1">
                {getScoreLabel(devScore)}
              </div>
              <div className="text-xs sm:text-sm text-white/80">
                {getScoreDescription(devScore)}
              </div>
            </div>

            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${devScore}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800/50">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-bold text-blue-900 dark:text-blue-300 text-xs sm:text-sm">
              Activity
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-400 font-medium leading-relaxed">
            {activityPattern === "consistent" && "📅 Consistent daily"}
            {activityPattern === "burst" && "⚡ Burst activity"}
            {activityPattern === "sporadic" && "🌊 Sporadic"}
            {activityPattern === "comeback" && "🔥 Strong comeback"}
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800/50">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-800/30 rounded-lg">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-bold text-purple-900 dark:text-purple-300 text-xs sm:text-sm">
              Focus
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-400 font-medium leading-relaxed">
            {projectFocus === "deep" && "🎯 Deep focus"}
            {projectFocus === "broad" && "🌐 Broad range"}
            {projectFocus === "balanced" && "⚖️ Balanced"}
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-gradient-to-br from-green-50 to-emerald-100/50 dark:from-green-900/20 dark:to-emerald-900/10 rounded-xl border border-green-200 dark:border-green-800/50">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-800/30 rounded-lg">
              <GitBranch className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-bold text-green-900 dark:text-green-300 text-xs sm:text-sm">
              Docs
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-green-700 dark:text-green-400 font-medium leading-relaxed">
            {metrics.documentationHabits === "excellent" && "⭐ Excellent"}
            {metrics.documentationHabits === "good" && "✅ Good"}
            {metrics.documentationHabits === "inconsistent" &&
              "⚠️ Inconsistent"}
            {metrics.documentationHabits === "poor" && "📝 Needs work"}
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-50 to-orange-100/50 dark:from-amber-900/20 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800/50">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 bg-amber-100 dark:bg-amber-800/30 rounded-lg">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h4 className="font-bold text-amber-900 dark:text-amber-300 text-xs sm:text-sm">
              Impact
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
            {metrics.impactScore >= 80 && "🚀 High impact"}
            {metrics.impactScore >= 60 &&
              metrics.impactScore < 80 &&
              "⚡ Solid"}
            {metrics.impactScore >= 40 &&
              metrics.impactScore < 60 &&
              "📈 Growing"}
            {metrics.impactScore < 40 && "🌱 Building"}
          </p>
        </div>
      </div>
    </div>
  );
}

function getScoreLabel(score) {
  if (score >= 90) return "🏆 Elite Developer";
  if (score >= 75) return "⭐ Excellent";
  if (score >= 60) return "💎 Advanced";
  if (score >= 40) return "📈 Intermediate";
  return "🌱 Developing";
}

function getScoreDescription(score) {
  if (score >= 90) return "Top-tier performance across all metrics";
  if (score >= 75) return "Strong performance with minor areas for growth";
  if (score >= 60) return "Solid foundation with room to improve";
  if (score >= 40) return "Building skills and consistency";
  return "Early stage developer journey";
}
