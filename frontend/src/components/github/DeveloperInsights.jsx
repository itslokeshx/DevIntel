import React from 'react';
import { Brain, Sparkles, TrendingUp, Target, Lightbulb } from 'lucide-react';

/**
 * AI-powered developer insights display
 */
export function DeveloperInsights({ personality, growthTrajectory }) {
    if (!personality || !growthTrajectory) return null;

    const difficultyColors = {
        'Easy': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        'Medium': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
        'Hard': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-purple-500" />
                <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    AI-Powered Insights
                </h2>
            </div>

            {/* Personality Analysis */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 shadow-lg border border-purple-200 dark:border-purple-800">
                <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Developer Personality
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <div className="text-sm text-purple-700 dark:text-purple-300 mb-1">Archetype</div>
                        <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                            {personality.archetype}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-purple-700 dark:text-purple-300 mb-1">Coding Style</div>
                        <div className="text-xl font-semibold text-purple-900 dark:text-purple-100">
                            {personality.codingStyle}
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="text-sm text-purple-700 dark:text-purple-300 mb-2">Work Pattern</div>
                    <p className="text-purple-900 dark:text-purple-100">
                        {personality.workPattern}
                    </p>
                </div>

                <div className="mb-4">
                    <div className="text-sm text-purple-700 dark:text-purple-300 mb-2">Motivation</div>
                    <p className="text-purple-900 dark:text-purple-100 italic">
                        "{personality.motivations}"
                    </p>
                </div>

                {/* Traits */}
                <div>
                    <div className="text-sm text-purple-700 dark:text-purple-300 mb-2">Key Traits</div>
                    <div className="flex flex-wrap gap-2">
                        {personality.traits.map((trait, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 rounded-full text-sm font-medium"
                            >
                                {trait}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Strengths */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-500" />
                    Core Strengths
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {personality.strengths.map((strength, index) => (
                        <div
                            key={index}
                            className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
                        >
                            <div className="text-green-700 dark:text-green-300 font-medium">
                                {strength}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Growth Trajectory */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 shadow-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Growth Trajectory
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <div className="text-sm text-blue-700 dark:text-blue-300 mb-1">Current Level</div>
                        <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
                            {growthTrajectory.currentLevel}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-blue-700 dark:text-blue-300 mb-1">Timeframe</div>
                        <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
                            {growthTrajectory.timeframe}
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="text-sm text-blue-700 dark:text-blue-300 mb-2">Next Milestone</div>
                    <div className="p-4 bg-blue-100 dark:bg-blue-800/30 rounded-xl">
                        <p className="text-blue-900 dark:text-blue-100 font-medium">
                            🎯 {growthTrajectory.nextMilestone}
                        </p>
                    </div>
                </div>

                {/* Recommendations */}
                <div>
                    <div className="text-sm text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Personalized Recommendations
                    </div>
                    <div className="space-y-3">
                        {growthTrajectory.recommendations.map((rec, index) => (
                            <div
                                key={index}
                                className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-blue-200 dark:border-blue-700"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="font-semibold text-blue-900 dark:text-blue-100">
                                        {rec.area}
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[rec.difficulty]}`}>
                                        {rec.difficulty}
                                    </span>
                                </div>
                                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">
                                    {rec.action}
                                </p>
                                <p className="text-xs text-text-tertiary-light dark:text-text-tertiary-dark italic">
                                    💡 {rec.impact}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Learning Path */}
                <div className="mt-6">
                    <div className="text-sm text-blue-700 dark:text-blue-300 mb-3">Learning Path</div>
                    <div className="flex flex-wrap gap-2">
                        {growthTrajectory.learningPath.map((step, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 rounded-full text-sm font-medium">
                                    {index + 1}. {step}
                                </span>
                                {index < growthTrajectory.learningPath.length - 1 && (
                                    <span className="text-blue-400">→</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
