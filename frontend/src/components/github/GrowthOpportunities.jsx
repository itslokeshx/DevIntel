import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ChevronDown, ChevronUp, Zap, TrendingUp, BookOpen } from 'lucide-react';

export function GrowthOpportunities({ growthOps, metrics, repositories }) {
    const [expandedIndex, setExpandedIndex] = useState(null);

    // Deterministic opportunity detection
    const opportunities = growthOps && growthOps.length > 0 ? growthOps : generateDeterministicOpportunities(metrics, repositories);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
            <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">🎯 Growth Roadmap</h3>
            </div>

            <div className="space-y-4">
                {opportunities.map((opp, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden"
                    >
                        {/* Header */}
                        <button
                            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <div className="flex items-center gap-4 flex-1">
                                {/* Number badge */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center text-lg">
                                    {index + 1}
                                </div>

                                <div className="text-left flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                                            {opp.title}
                                        </h4>
                                        {/* Difficulty badge */}
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${opp.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                                opp.difficulty === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                                                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                            }`}>
                                            {opp.difficulty.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {opp.gap}
                                    </p>
                                </div>
                            </div>

                            {/* Expand icon */}
                            <motion.div
                                animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            </motion.div>
                        </button>

                        {/* Expandable content */}
                        <AnimatePresence>
                            {expandedIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-6 space-y-4 border-t border-gray-200 dark:border-gray-800 pt-4">
                                        {/* Why It Matters */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                                                <h5 className="font-semibold text-gray-900 dark:text-gray-100">Why It Matters</h5>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 pl-6">
                                                {opp.impact}
                                            </p>
                                        </div>

                                        {/* Action Steps */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                <h5 className="font-semibold text-gray-900 dark:text-gray-100">Action Steps</h5>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 pl-6">
                                                {opp.action}
                                            </p>
                                        </div>

                                        {/* Impact indicator */}
                                        <div className="flex items-center gap-2 pl-6 pt-2">
                                            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                                            <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                                                High Impact Opportunity
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

/**
 * Deterministic opportunity detection (no AI needed)
 */
function generateDeterministicOpportunities(metrics, repositories) {
    const opportunities = [];

    // Calculate documentation score
    const reposWithReadme = repositories?.filter(r => r.hasReadme).length || 0;
    const totalRepos = repositories?.length || 1;
    const docScore = Math.round((reposWithReadme / totalRepos) * 100);

    // 1. Documentation Quality
    if (docScore < 50) {
        opportunities.push({
            title: 'Documentation Quality',
            gap: `Only ${docScore}% of repositories have comprehensive READMEs`,
            action: 'Add detailed README files to your top 3 most-starred repositories this week. Include: project overview, installation steps, usage examples, and contribution guidelines.',
            impact: 'Improves discoverability, demonstrates professionalism, and makes projects more accessible to collaborators and potential employers.',
            difficulty: 'Easy'
        });
    }

    // 2. Consistency
    const consistencyScore = metrics?.consistencyScore || 0;
    if (consistencyScore < 70) {
        opportunities.push({
            title: 'Commit Consistency',
            gap: `Consistency score of ${consistencyScore}/100 indicates irregular contribution patterns`,
            action: 'Set a goal of 3-4 commits per week. Create a coding schedule and stick to it. Even small, incremental progress builds momentum.',
            impact: 'Builds coding rhythm, improves skill retention, and demonstrates reliability to potential employers and collaborators.',
            difficulty: 'Medium'
        });
    }

    // 3. Community Engagement
    const impactScore = metrics?.impactScore || 0;
    if (impactScore < 40) {
        opportunities.push({
            title: 'Open Source Contributions',
            gap: 'Limited external contributions detected',
            action: 'Contribute to 1-2 open source projects this month. Start with documentation fixes or "good first issue" labels. Focus on projects you already use.',
            impact: 'Expands your network, improves collaboration skills, and provides real-world experience with large codebases.',
            difficulty: 'Medium'
        });
    }

    // 4. Streak Extension (if current streak > 20)
    const currentStreak = metrics?.currentStreak || 0;
    if (currentStreak > 20 && currentStreak < 90) {
        opportunities.push({
            title: 'Streak Mastery',
            gap: `Current ${currentStreak}-day streak shows dedication`,
            action: 'Challenge yourself to reach a 90-day streak. Set up automated reminders and prepare small tasks for busy days to maintain momentum.',
            impact: 'Demonstrates exceptional consistency and discipline. 90+ day streaks place you in the top 5% of developers.',
            difficulty: 'Hard'
        });
    }

    // Return top 3 opportunities
    return opportunities.slice(0, 3);
}
