import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Code2, GitBranch, Clock, Target, Zap, Award } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

export function DeveloperAnalysis({ metrics, contributions, repositories }) {
  if (!metrics) return null;

  // Prepare radar chart data with accurate values
  const radarData = [
    {
      metric: "Consistency",
      value: metrics.consistencyScore || 0,
      fullMark: 100,
    },
    {
      metric: "Impact",
      value: metrics.impactScore || 0,
      fullMark: 100,
    },
    {
      metric: "Quality",
      value: metrics.qualityScore || 0,
      fullMark: 100,
    },
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
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-900/50 rounded-[24px] border border-gray-200 dark:border-gray-800 p-8 md:p-10 shadow-lg">
      <h3 className="text-heading-lg font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
        <span className="text-3xl">📊</span>
        Developer Analysis
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Radar Chart - Enhanced */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <h4 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
            Skills Pentagon
          </h4>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid 
                stroke="#e5e7eb" 
                strokeDasharray="3 3"
                className="dark:stroke-gray-700"
              />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "#6b7280", fontSize: 13, fontWeight: 600 }}
                className="dark:fill-gray-400"
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                tickCount={5}
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.5}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Dev Score Card - Premium */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-6 h-6" />
              <h4 className="text-lg font-bold">Developer Score</h4>
            </div>
            
            <div className="flex items-end gap-3 mb-4">
              <div className="text-6xl font-extrabold">{devScore}</div>
              <div className="text-3xl font-bold text-white/70 mb-2">/100</div>
            </div>
            
            <div className="mb-6">
              <div className="text-xl font-semibold mb-2">{getScoreLabel(devScore)}</div>
              <div className="text-sm text-white/80">{getScoreDescription(devScore)}</div>
            </div>
            
            {/* Score bar */}
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${devScore}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Analysis Cards Grid - Premium Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.03, y: -4 }}
          className="p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800/50 shadow-sm"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-bold text-blue-900 dark:text-blue-300 text-sm">
              Activity Pattern
            </h4>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
            {activityPattern === "consistent" &&
              "📅 Consistent daily contributions"}
            {activityPattern === "burst" &&
              "⚡ Burst activity with intense periods"}
            {activityPattern === "sporadic" && "🌊 Sporadic contributions"}
            {activityPattern === "comeback" && "🔥 Strong comeback after break"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.03, y: -4 }}
          className="p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800/50 shadow-sm"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-800/30 rounded-lg">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-bold text-purple-900 dark:text-purple-300 text-sm">
              Project Focus
            </h4>
          </div>
          <p className="text-sm text-purple-700 dark:text-purple-400 font-medium">
            {projectFocus === "deep" && "🎯 Deep focus on few projects"}
            {projectFocus === "broad" && "🌐 Broad range of projects"}
            {projectFocus === "balanced" && "⚖️ Balanced approach"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.03, y: -4 }}
          className="p-5 bg-gradient-to-br from-green-50 to-emerald-100/50 dark:from-green-900/20 dark:to-emerald-900/10 rounded-xl border border-green-200 dark:border-green-800/50 shadow-sm"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-800/30 rounded-lg">
              <GitBranch className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-bold text-green-900 dark:text-green-300 text-sm">
              Documentation
            </h4>
          </div>
          <p className="text-sm text-green-700 dark:text-green-400 font-medium">
            {metrics.documentationHabits === "excellent" &&
              "⭐ Excellent documentation"}
            {metrics.documentationHabits === "good" && "✅ Good documentation"}
            {metrics.documentationHabits === "inconsistent" &&
              "⚠️ Inconsistent documentation"}
            {metrics.documentationHabits === "poor" && "📝 Needs improvement"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.03, y: -4 }}
          className="p-5 bg-gradient-to-br from-amber-50 to-orange-100/50 dark:from-amber-900/20 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800/50 shadow-sm"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-800/30 rounded-lg">
              <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h4 className="font-bold text-amber-900 dark:text-amber-300 text-sm">
              Impact Level
            </h4>
          </div>
          <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
            {metrics.impactScore >= 80 && "🚀 High impact contributor"}
            {metrics.impactScore >= 60 && metrics.impactScore < 80 && "⚡ Solid impact"}
            {metrics.impactScore >= 40 && metrics.impactScore < 60 && "📈 Growing impact"}
            {metrics.impactScore < 40 && "🌱 Building momentum"}
          </p>
        </motion.div>
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
