import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { ArrowLeft, Sparkles, Sword, TrendingUp, Code2 } from 'lucide-react';
import { comparisonAPI } from '../services/api';

export default function GitHubComparison() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [userA, setUserA] = useState('');
    const [userB, setUserB] = useState('');

    const handleCompare = async () => {
        if (!userA.trim() || !userB.trim()) {
            setError('Both usernames are required');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setData(null);

            const response = await comparisonAPI.compare(userA.trim(), userB.trim());
            setData(response.data || response);
            setLoading(false);
        } catch (err) {
            console.error('Comparison error:', err);
            setError(err.message || 'Failed to compare users');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">THE ARENA</h1>
                    <div></div>
                </div>

                {/* Input Form */}
                {!data && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto mb-12"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Developer 1
                                </label>
                                <input
                                    type="text"
                                    value={userA}
                                    onChange={(e) => setUserA(e.target.value)}
                                    placeholder="Enter GitHub username"
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="text-4xl font-bold text-gray-400 dark:text-gray-600">VS</div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Developer 2
                                </label>
                                <input
                                    type="text"
                                    value={userB}
                                    onChange={(e) => setUserB(e.target.value)}
                                    placeholder="Enter GitHub username"
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleCompare}
                            disabled={loading || !userA.trim() || !userB.trim()}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Sword className="w-5 h-5" />
                            Start Battle
                        </button>
                        {error && (
                            <p className="mt-4 text-center text-red-600 dark:text-red-400">{error}</p>
                        )}
                    </motion.div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Analyzing profiles...</p>
                    </div>
                )}

                {/* Results */}
                {data && !loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-12"
                    >
                        {/* AI Referee Verdict */}
                        <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-3 mb-6">
                                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">🧬 AI REFEREE VERDICT</h2>
                            </div>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                {data.comparison?.aiVerdict || data.comparison?.summary || 'Analysis complete.'}
                            </p>
                            <div className="mt-6 pt-6 border-t border-blue-200 dark:border-blue-800">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-full">
                                    <span className="text-2xl">🏆</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                                        {data.comparison?.verdict || 'Both are valuable developers'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Head-to-Head Comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Developer A */}
                            <ProfileCard
                                profile={data.userA?.profile || data.userA}
                                username={userA}
                                metrics={data.comparison?.metrics || {}}
                                side="A"
                            />
                            {/* Developer B */}
                            <ProfileCard
                                profile={data.userB?.profile || data.userB}
                                username={userB}
                                metrics={data.comparison?.metrics || {}}
                                side="B"
                            />
                        </div>

                        {/* Metrics Comparison */}
                        {data.comparison?.metrics && (
                            <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">📊 HEAD-TO-HEAD METRICS</h2>
                                <div className="space-y-6">
                                    <MetricBar
                                        label="Dev Score"
                                        valueA={data.comparison.metrics.devScore?.userA || 0}
                                        valueB={data.comparison.metrics.devScore?.userB || 0}
                                    />
                                    <MetricBar
                                        label="Repositories"
                                        valueA={data.comparison.metrics.totalProjects?.userA || 0}
                                        valueB={data.comparison.metrics.totalProjects?.userB || 0}
                                    />
                                    <MetricBar
                                        label="Stars"
                                        valueA={data.comparison.metrics.totalStars?.userA || 0}
                                        valueB={data.comparison.metrics.totalStars?.userB || 0}
                                    />
                                    <MetricBar
                                        label="Commits"
                                        valueA={data.comparison.metrics.totalCommits?.userA || 0}
                                        valueB={data.comparison.metrics.totalCommits?.userB || 0}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Tech Stack Overlap */}
                        {data.comparison?.techStack && (
                            <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                                    <Code2 className="w-6 h-6" />
                                    🎯 TECH STACK VENN DIAGRAM
                                </h2>
                                <div className="text-center py-8">
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        Shared Technologies: {data.comparison.techStack.shared?.join(', ') || 'None'}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-500">
                                        Overlap: {data.comparison.techStack.overlapPercentage || 0}%
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function ProfileCard({ profile, username, metrics, side }) {
    const userMetrics = side === 'A' ? {
        devScore: metrics.devScore?.userA || 0,
        repos: metrics.totalProjects?.userA || 0,
        stars: metrics.totalStars?.userA || 0,
        commits: metrics.totalCommits?.userA || 0,
    } : {
        devScore: metrics.devScore?.userB || 0,
        repos: metrics.totalProjects?.userB || 0,
        stars: metrics.totalStars?.userB || 0,
        commits: metrics.totalCommits?.userB || 0,
    };

    return (
        <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4 mb-6">
                <img
                    src={profile?.avatarUrl}
                    alt={username}
                    className="w-20 h-20 rounded-full border-2 border-gray-200 dark:border-gray-800"
                />
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {profile?.name || username}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">@{username}</p>
                </div>
            </div>
            <div className="space-y-4">
                <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                        <CountUp end={userMetrics.devScore} duration={1.5} />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Dev Score</div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full mt-2 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${userMetrics.devScore}%` }}
                            transition={{ duration: 1.5 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            <CountUp end={userMetrics.repos} duration={1.5} />
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Repos</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            <CountUp end={userMetrics.stars} duration={1.5} />
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Stars</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            <CountUp end={userMetrics.commits} duration={1.5} />
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Commits</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricBar({ label, valueA, valueB }) {
    const maxValue = Math.max(valueA, valueB, 1);
    const percentageA = (valueA / maxValue) * 100;
    const percentageB = (valueB / maxValue) * 100;

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                        <CountUp end={valueA} duration={1.5} />
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentageA}%` }}
                            transition={{ duration: 1.5 }}
                            className="h-full bg-blue-500"
                        />
                    </div>
                </div>
                <div>
                    <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 text-right">
                        <CountUp end={valueB} duration={1.5} />
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentageB}%` }}
                            transition={{ duration: 1.5 }}
                            className="h-full bg-purple-500 ml-auto"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
