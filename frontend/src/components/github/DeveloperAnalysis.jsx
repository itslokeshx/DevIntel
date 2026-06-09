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
    { metric: "Consistency", value: metrics.consistencyScore || 0, fullMark: 100 },
    { metric: "Impact", value: metrics.impactScore || 0, fullMark: 100 },
    { metric: "Quality", value: metrics.qualityScore || 0, fullMark: 100 },
    { metric: "Activity", value: Math.min((contributions?.totalCommits || 0) / 10, 100), fullMark: 100 },
    { metric: "Community", value: Math.min((repositories?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0) / 5, 100), fullMark: 100 },
  ];

  const activityPattern = metrics.activityPattern || "consistent";
  const projectFocus = metrics.projectFocus || "balanced";
  const devScore = metrics.devScore || 0;

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 sm:p-7">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-6">
        Developer Analysis
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Radar Chart */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-subtle)]">
          <h4 className="text-[11px] font-medium text-[var(--text-tertiary)] mb-2 text-center uppercase tracking-wider">
            Skills Pentagon
          </h4>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid
                stroke="var(--border-default)"
                strokeDasharray="3 3"
              />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "var(--text-tertiary)", fontSize: 10, fontWeight: 500 }}
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke="var(--accent)"
                fill="var(--accent)"
                fillOpacity={0.12}
                strokeWidth={1.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Dev Score */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-5 border border-[var(--border-subtle)] flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-[var(--text-tertiary)]" />
            <h4 className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
              Developer Score
            </h4>
          </div>

          <div className="flex items-end gap-1.5 mb-2">
            <span className="text-4xl sm:text-5xl font-semibold text-[var(--text-primary)] tracking-tight">
              {devScore}
            </span>
            <span className="text-lg text-[var(--text-tertiary)] font-normal mb-1">/100</span>
          </div>

          <div className="mb-4">
            <div className="text-sm font-medium text-[var(--text-primary)] mb-0.5">
              {getScoreLabel(devScore)}
            </div>
            <div className="text-xs text-[var(--text-tertiary)]">
              {getScoreDescription(devScore)}
            </div>
          </div>

          <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${devScore}%` }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="h-full bg-[var(--accent)] rounded-full"
              style={{ opacity: 0.7 }}
            />
          </div>
        </div>
      </div>

      {/* Analysis grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <AnalysisCard
          icon={<Clock className="w-3.5 h-3.5" />}
          label="Activity"
          value={
            activityPattern === "consistent" ? "Consistent" :
            activityPattern === "burst" ? "Burst" :
            activityPattern === "sporadic" ? "Sporadic" :
            activityPattern === "comeback" ? "Comeback" : activityPattern
          }
        />
        <AnalysisCard
          icon={<Target className="w-3.5 h-3.5" />}
          label="Focus"
          value={
            projectFocus === "deep" ? "Deep focus" :
            projectFocus === "broad" ? "Broad range" :
            projectFocus === "balanced" ? "Balanced" : projectFocus
          }
        />
        <AnalysisCard
          icon={<GitBranch className="w-3.5 h-3.5" />}
          label="Docs"
          value={
            metrics.documentationHabits === "excellent" ? "Excellent" :
            metrics.documentationHabits === "good" ? "Good" :
            metrics.documentationHabits === "inconsistent" ? "Inconsistent" :
            metrics.documentationHabits === "poor" ? "Needs work" : "N/A"
          }
        />
        <AnalysisCard
          icon={<Zap className="w-3.5 h-3.5" />}
          label="Impact"
          value={
            metrics.impactScore >= 80 ? "High" :
            metrics.impactScore >= 60 ? "Solid" :
            metrics.impactScore >= 40 ? "Growing" : "Building"
          }
        />
      </div>
    </div>
  );
}

function AnalysisCard({ icon, label, value }) {
  return (
    <div className="p-3.5 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-subtle)]">
      <div className="flex items-center gap-1.5 mb-2 text-[var(--text-tertiary)]">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xs font-medium text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

function getScoreLabel(score) {
  if (score >= 90) return "Elite Developer";
  if (score >= 75) return "Excellent";
  if (score >= 60) return "Advanced";
  if (score >= 40) return "Intermediate";
  return "Developing";
}

function getScoreDescription(score) {
  if (score >= 90) return "Top-tier performance across all metrics";
  if (score >= 75) return "Strong performance with minor areas for growth";
  if (score >= 60) return "Solid foundation with room to improve";
  if (score >= 40) return "Building skills and consistency";
  return "Early stage developer journey";
}
