import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Code2, GitBranch, Clock, Target } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function DeveloperAnalysis({ metrics, contributions, repositories }) {
  if (!metrics) return null;

  // Prepare radar chart data
  const radarData = [
    {
      metric: "Consistency",
      value: metrics.consistencyScore || 0,
    },
    {
      metric: "Impact",
      value: metrics.impactScore || 0,
    },
    {
      metric: "Quality",
      value: metrics.qualityScore || 0,
    },
    {
      metric: "Activity",
      value: Math.min((contributions?.totalCommits || 0) / 10, 100),
    },
    {
      metric: "Community",
      value: Math.min(
        (repositories?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0) / 5,
        100,
      ),
    },
  ];

  const activityPattern = metrics.activityPattern || "consistent";
  const projectFocus = metrics.projectFocus || "balanced";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[20px] border border-gray-200 dark:border-gray-800 p-10">
      <h3 className="text-heading-lg font-bold text-gray-900 dark:text-white mb-6">
        📊 Developer Analysis
      </h3>

      {/* Radar Chart */}
      <div className="mb-8">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "#9ca3af", fontSize: 10 }}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-semibold text-blue-900 dark:text-blue-300">
              Activity Pattern
            </h4>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-400 capitalize">
            {activityPattern === "consistent" &&
              "📅 Consistent daily contributions"}
            {activityPattern === "burst" &&
              "⚡ Burst activity with intense periods"}
            {activityPattern === "sporadic" && "🌊 Sporadic contributions"}
            {activityPattern === "comeback" && "🔥 Strong comeback after break"}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h4 className="font-semibold text-purple-900 dark:text-purple-300">
              Project Focus
            </h4>
          </div>
          <p className="text-sm text-purple-700 dark:text-purple-400 capitalize">
            {projectFocus === "deep" && "🎯 Deep focus on few projects"}
            {projectFocus === "broad" && "🌐 Broad range of projects"}
            {projectFocus === "balanced" && "⚖️ Balanced approach"}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h4 className="font-semibold text-green-900 dark:text-green-300">
              Documentation
            </h4>
          </div>
          <p className="text-sm text-green-700 dark:text-green-400 capitalize">
            {metrics.documentationHabits === "excellent" &&
              "⭐ Excellent documentation"}
            {metrics.documentationHabits === "good" && "✅ Good documentation"}
            {metrics.documentationHabits === "inconsistent" &&
              "⚠️ Inconsistent documentation"}
            {metrics.documentationHabits === "poor" && "📝 Needs improvement"}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-300">
              Dev Score
            </h4>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            {metrics.devScore || 0}/100 - {getScoreLabel(metrics.devScore || 0)}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function getScoreLabel(score) {
  if (score >= 90) return "Elite";
  if (score >= 75) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Average";
  return "Developing";
}
