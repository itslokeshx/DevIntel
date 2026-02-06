import React from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export function ActivityRadarChart({ userAData, userBData, userA, userB }) {
    // Calculate scores for each axis (0-100 scale)
    const calculateScores = (data) => {
        const repos = data.repositories?.length || 0;
        const commits = data.contributions?.totalCommits || 0;
        const stars = data.repositories?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0;
        const streak = data.contributions?.currentStreak || 0;
        const hasReadme = data.repositories?.filter(r => r.hasReadme).length || 0;

        return {
            // Consistency: Based on streak (max 365 days = 100)
            Consistency: Math.min((streak / 365) * 100, 100),

            // Velocity: Commits per repo (max 100 commits/repo = 100)
            Velocity: repos > 0 ? Math.min((commits / repos) * 10, 100) : 0,

            // Impact: Stars per repo (max 50 stars/repo = 100)
            Impact: repos > 0 ? Math.min((stars / repos) * 2, 100) : 0,

            // Documentation: Percentage with README
            Documentation: repos > 0 ? (hasReadme / repos) * 100 : 0,

            // Community: Based on external contributions (placeholder - would need real data)
            Community: Math.min((repos / 50) * 100, 100) // Simplified metric
        };
    };

    const scoresA = calculateScores(userAData);
    const scoresB = calculateScores(userBData);

    // Prepare data for radar chart
    const data = [
        {
            category: 'Consistency',
            [userA]: Math.round(scoresA.Consistency),
            [userB]: Math.round(scoresB.Consistency),
            fullMark: 100
        },
        {
            category: 'Velocity',
            [userA]: Math.round(scoresA.Velocity),
            [userB]: Math.round(scoresB.Velocity),
            fullMark: 100
        },
        {
            category: 'Impact',
            [userA]: Math.round(scoresA.Impact),
            [userB]: Math.round(scoresB.Impact),
            fullMark: 100
        },
        {
            category: 'Documentation',
            [userA]: Math.round(scoresA.Documentation),
            [userB]: Math.round(scoresB.Documentation),
            fullMark: 100
        },
        {
            category: 'Community',
            [userA]: Math.round(scoresA.Community),
            [userB]: Math.round(scoresB.Community),
            fullMark: 100
        }
    ];

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3 shadow-xl">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {payload[0].payload.category}
                    </p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
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
        <div className="space-y-6">
            {/* Chart */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={data}>
                        <PolarGrid stroke="#374151" strokeDasharray="3 3" />
                        <PolarAngleAxis
                            dataKey="category"
                            tick={{ fill: '#9ca3af', fontSize: 14, fontWeight: 600 }}
                        />
                        <PolarRadiusAxis
                            angle={90}
                            domain={[0, 100]}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                        />

                        {/* Fighter A */}
                        <Radar
                            name={userA}
                            dataKey={userA}
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.4}
                            strokeWidth={2}
                        />

                        {/* Fighter B */}
                        <Radar
                            name={userB}
                            dataKey={userB}
                            stroke="#a855f7"
                            fill="#a855f7"
                            fillOpacity={0.4}
                            strokeWidth={2}
                        />

                        <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Legend */}
            <div className="flex justify-center gap-8">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{userA}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{userB}</span>
                </div>
            </div>

            {/* Category descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <CategoryCard
                    title="Consistency"
                    description="Based on contribution streak"
                    scoreA={scoresA.Consistency}
                    scoreB={scoresB.Consistency}
                />
                <CategoryCard
                    title="Velocity"
                    description="Commits per repository"
                    scoreA={scoresA.Velocity}
                    scoreB={scoresB.Velocity}
                />
                <CategoryCard
                    title="Impact"
                    description="Stars earned per repo"
                    scoreA={scoresA.Impact}
                    scoreB={scoresB.Impact}
                />
                <CategoryCard
                    title="Documentation"
                    description="Repos with README"
                    scoreA={scoresA.Documentation}
                    scoreB={scoresB.Documentation}
                />
                <CategoryCard
                    title="Community"
                    description="Project diversity"
                    scoreA={scoresA.Community}
                    scoreB={scoresB.Community}
                />
            </div>
        </div>
    );
}

function CategoryCard({ title, description, scoreA, scoreB }) {
    const winner = scoreA > scoreB ? 'A' : scoreB > scoreA ? 'B' : 'tie';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
        >
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{description}</p>
            <div className="flex items-center justify-between">
                <div className={`text-sm font-medium ${winner === 'A' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
                    {Math.round(scoreA)}
                </div>
                <div className={`text-sm font-medium ${winner === 'B' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'}`}>
                    {Math.round(scoreB)}
                </div>
            </div>
        </motion.div>
    );
}
