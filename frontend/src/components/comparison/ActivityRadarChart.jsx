import React from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export function ActivityRadarChart({ userAData, userBData, userA, userB }) {
    const calculateScores = (data) => {
        const repos = data.repositories?.length || 0;
        const commits = data.contributions?.totalCommits || 0;
        const stars = data.repositories?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0;
        const streak = data.contributions?.currentStreak || 0;
        const hasReadme = data.repositories?.filter(r => r.hasReadme).length || 0;

        return {
            Consistency: Math.min((streak / 365) * 100, 100),
            Velocity: repos > 0 ? Math.min((commits / repos) * 10, 100) : 0,
            Impact: repos > 0 ? Math.min((stars / repos) * 2, 100) : 0,
            Documentation: repos > 0 ? (hasReadme / repos) * 100 : 0,
            Community: Math.min((repos / 50) * 100, 100)
        };
    };

    const scoresA = calculateScores(userAData);
    const scoresB = calculateScores(userBData);

    const data = ['Consistency', 'Velocity', 'Impact', 'Documentation', 'Community'].map(category => ({
        category,
        [userA]: Math.round(scoresA[category]),
        [userB]: Math.round(scoresB[category]),
        fullMark: 100
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg text-sm">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{payload[0].payload.category}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-gray-600 dark:text-gray-300">
                                {entry.name}: {entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data}>
                    <PolarGrid stroke="#e5e7eb" className="dark:stroke-gray-700" />
                    <PolarAngleAxis
                        dataKey="category"
                        tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name={userA}
                        dataKey={userA}
                        stroke="#2563eb"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                    />
                    <Radar
                        name={userB}
                        dataKey={userB}
                        stroke="#9333ea"
                        fill="#a855f7"
                        fillOpacity={0.3}
                        strokeWidth={2}
                    />
                    <Tooltip content={<CustomTooltip />} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
