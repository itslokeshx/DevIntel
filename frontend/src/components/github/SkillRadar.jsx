import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

export function SkillRadar({ metrics, repositories }) {
    // Calculate dimension scores
    const calculateScores = () => {
        const devScore = metrics?.devScore || 0;
        const consistencyScore = metrics?.consistencyScore || 0;
        const impactScore = metrics?.impactScore || 0;

        // Calculate building score (project quality)
        const activeProjects = repositories?.filter(r => r.maturityStage === 'active').length || 0;
        const totalProjects = repositories?.length || 1;
        const buildingScore = Math.min(100, (activeProjects / totalProjects) * 100 + devScore * 0.3);

        // Calculate documentation score
        const avgDocQuality = repositories?.reduce((sum, r) => {
            const quality = r.documentationQuality === 'excellent' ? 100 :
                r.documentationQuality === 'good' ? 75 :
                    r.documentationQuality === 'basic' ? 50 : 25;
            return sum + quality;
        }, 0) / (repositories?.length || 1);

        return [
            {
                dimension: 'Building',
                score: Math.round(buildingScore),
                fullMark: 100,
                description: 'Project creation & maintenance'
            },
            {
                dimension: 'Consistency',
                score: Math.round(consistencyScore),
                fullMark: 100,
                description: 'Regular coding activity'
            },
            {
                dimension: 'Impact',
                score: Math.round(impactScore),
                fullMark: 100,
                description: 'Community reach & influence'
            },
            {
                dimension: 'Documentation',
                score: Math.round(avgDocQuality),
                fullMark: 100,
                description: 'Code documentation quality'
            },
            {
                dimension: 'Quality',
                score: Math.round(devScore),
                fullMark: 100,
                description: 'Overall code quality'
            }
        ];
    };

    const radarData = calculateScores();
    const avgScore = Math.round(radarData.reduce((sum, item) => sum + item.score, 0) / radarData.length);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                        Developer Strengths
                    </h3>
                    <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                        Multi-dimensional skill assessment
                    </p>
                </div>

                <div className="text-center px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {avgScore}
                    </div>
                    <div className="text-xs text-primary-700 dark:text-primary-300">
                        Avg Score
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Radar Chart */}
                <div className="w-full lg:w-1/2">
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={radarData}>
                            <PolarGrid strokeDasharray="3 3" stroke="#9CA3AF" />
                            <PolarAngleAxis
                                dataKey="dimension"
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                            />
                            <PolarRadiusAxis
                                angle={90}
                                domain={[0, 100]}
                                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                            />
                            <Radar
                                dataKey="score"
                                stroke="#3B82F6"
                                fill="#3B82F6"
                                fillOpacity={0.5}
                                strokeWidth={2}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Score Breakdown */}
                <div className="w-full lg:w-1/2 space-y-3">
                    {radarData.map((item, index) => (
                        <div key={index} className="space-y-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                                        {item.dimension}
                                    </span>
                                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                        {item.description}
                                    </p>
                                </div>
                                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                    {item.score}
                                </span>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${item.score >= 80 ? 'bg-green-500' :
                                            item.score >= 60 ? 'bg-blue-500' :
                                                item.score >= 40 ? 'bg-yellow-500' :
                                                    'bg-orange-500'
                                        }`}
                                    style={{ width: `${item.score}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Insight */}
            <div className="mt-6 p-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-lg border border-light-border dark:border-dark-border">
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                        Strength Profile:
                    </span>{' '}
                    {avgScore >= 80 ? 'Exceptional all-around developer with strong fundamentals across all dimensions.' :
                        avgScore >= 60 ? 'Well-rounded developer with solid skills and room for targeted growth.' :
                            avgScore >= 40 ? 'Developing skills with clear areas for improvement and growth.' :
                                'Early-stage developer building foundational skills across multiple areas.'}
                </p>
            </div>
        </div>
    );
}
