import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { ArrowLeft, Sparkles, Sword, Code2, RefreshCw, X } from 'lucide-react';
import { comparisonAPI } from '../services/api';

export default function GitHubComparison() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [userA, setUserA] = useState('');
    const [userB, setUserB] = useState('');
    const [showNewCompare, setShowNewCompare] = useState(false);

    const handleCompare = async (newUserA = null, newUserB = null) => {
        const usernameA = newUserA || userA.trim();
        const usernameB = newUserB || userB.trim();

        if (!usernameA || !usernameB) {
            setError('Both usernames are required');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setData(null);
            setShowNewCompare(false);

            const response = await comparisonAPI.compare(usernameA, usernameB);
            console.log('📊 Comparison API Response:', response);
            console.log('📊 Response Data:', response.data);
            console.log('📊 Comparison Metrics:', response.data?.comparison);
            setData(response.data || response);
            setUserA(usernameA);
            setUserB(usernameB);
            setLoading(false);
        } catch (err) {
            console.error('Comparison error:', err);
            setError(err.message || 'Failed to compare users');
            setLoading(false);
        }
    };

    const handleNewCompare = () => {
        setShowNewCompare(true);
    };

    const handleClearCompare = () => {
        setData(null);
        setUserA('');
        setUserB('');
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Sticky Header with Compare Input */}
                <div className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 mb-8 -mx-6 px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Home
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">⚔️ THE ARENA</h1>
                        {data && (
                            <button
                                onClick={handleNewCompare}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                New Compare
                            </button>
                        )}
                    </div>

                    {/* Compare Input - Always Visible */}
                    <AnimatePresence>
                        {(!data || showNewCompare) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={userA}
                                            onChange={(e) => setUserA(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleCompare()}
                                            placeholder="Developer 1 username"
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-400 dark:text-gray-600">VS</div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={userB}
                                            onChange={(e) => setUserB(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleCompare()}
                                            placeholder="Developer 2 username"
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleCompare()}
                                        disabled={loading || !userA.trim() || !userB.trim()}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <Sword className="w-5 h-5" />
                                        {loading ? 'Comparing...' : 'Compare'}
                                    </button>
                                    {showNewCompare && (
                                        <button
                                            onClick={() => {
                                                setShowNewCompare(false);
                                                if (!data) {
                                                    handleClearCompare();
                                                }
                                            }}
                                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                                {error && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                        />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">Analyzing profiles...</p>
                    </div>
                )}

                {/* Results */}
                {data && !loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* AI Referee Verdict */}
                        <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-3 mb-6">
                                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">🧬 AI REFEREE VERDICT</h2>
                            </div>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                {data.comparison?.aiVerdict || data.comparison?.aiInsights?.verdict || data.comparison?.summary || 'Analysis complete.'}
                            </p>
                            <div className="flex items-center justify-center">
                                <div className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 rounded-full shadow-lg">
                                    <span className="text-2xl">🏆</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                                        {data.comparison?.winner === 'tie' ? 'BOTH LEGENDARY' :
                                            data.comparison?.winner ? `Winner: ${data.comparison.winner === 'A' ? userA : userB}` :
                                                'Both are valuable developers'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Head-to-Head Comparison - Symmetric Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Developer A */}
                            <ProfileCard
                                profile={data.userA?.profile || data.userA}
                                username={userA}
                                comparison={data.comparison}
                                side="A"
                                color="blue"
                            />
                            {/* Developer B */}
                            <ProfileCard
                                profile={data.userB?.profile || data.userB}
                                username={userB}
                                comparison={data.comparison}
                                side="B"
                                color="purple"
                            />
                        </div>

                        {/* Metrics Comparison - Symmetric */}
                        {data.comparison && (
                            <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">📊 HEAD-TO-HEAD METRICS</h2>
                                <div className="space-y-8">
                                    <SymmetricMetricBar
                                        label="Dev Score"
                                        valueA={data.comparison.devScore?.userA || data.comparison.metrics?.devScore?.userA || 0}
                                        valueB={data.comparison.devScore?.userB || data.comparison.metrics?.devScore?.userB || 0}
                                        userA={userA}
                                        userB={userB}
                                    />
                                    <SymmetricMetricBar
                                        label="Repositories"
                                        valueA={data.comparison.totalProjects?.userA || data.comparison.metrics?.totalProjects?.userA || 0}
                                        valueB={data.comparison.totalProjects?.userB || data.comparison.metrics?.totalProjects?.userB || 0}
                                        userA={userA}
                                        userB={userB}
                                    />
                                    <SymmetricMetricBar
                                        label="Total Stars"
                                        valueA={data.comparison.totalStars?.userA || data.comparison.metrics?.totalStars?.userA || 0}
                                        valueB={data.comparison.totalStars?.userB || data.comparison.metrics?.totalStars?.userB || 0}
                                        userA={userA}
                                        userB={userB}
                                    />
                                    <SymmetricMetricBar
                                        label="Total Commits"
                                        valueA={data.comparison.totalCommits?.userA || data.comparison.metrics?.totalCommits?.userA || 0}
                                        valueB={data.comparison.totalCommits?.userB || data.comparison.metrics?.totalCommits?.userB || 0}
                                        userA={userA}
                                        userB={userB}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Tech Stack Overlap - Symmetric */}
                        {data.comparison?.techStack && (
                            <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center flex items-center justify-center gap-2">
                                    <Code2 className="w-6 h-6" />
                                    🎯 TECH STACK OVERLAP
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <h4 className="font-semibold text-blue-400 mb-3 text-base">Only {userA}</h4>
                                        <div className="flex flex-wrap gap-1.5 justify-center min-h-[80px]">
                                            {(data.comparison.techStack.uniqueA || []).length > 0 ? (
                                                (data.comparison.techStack.uniqueA || []).slice(0, 10).map(tech => (
                                                    <span key={tech} className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md text-xs">
                                                        {tech}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-sm">None</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-center border-l border-r border-gray-200 dark:border-gray-800 px-4">
                                        <h4 className="font-semibold text-yellow-400 mb-3 text-base">Shared</h4>
                                        <div className="flex flex-wrap gap-1.5 justify-center min-h-[80px]">
                                            {(data.comparison.techStack.shared || []).length > 0 ? (
                                                (data.comparison.techStack.shared || []).slice(0, 10).map(tech => (
                                                    <span key={tech} className="bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-md text-xs font-semibold">
                                                        {tech}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-sm">None</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                                            <span className="font-semibold">{data.comparison.techStack.overlapPercentage || 0}%</span> overlap
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <h4 className="font-semibold text-purple-400 mb-3 text-base">Only {userB}</h4>
                                        <div className="flex flex-wrap gap-1.5 justify-center min-h-[80px]">
                                            {(data.comparison.techStack.uniqueB || []).length > 0 ? (
                                                (data.comparison.techStack.uniqueB || []).slice(0, 10).map(tech => (
                                                    <span key={tech} className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-md text-xs">
                                                        {tech}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-sm">None</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Additional Comparison Metrics */}
                        {data.comparison && (
                            <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">📈 ADDITIONAL METRICS</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                                            <CountUp end={data.comparison.consistencyScore?.userA || data.comparison.metrics?.consistencyScore?.userA || 0} duration={1.5} />
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">{userA} Consistency</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                                            <CountUp end={data.comparison.consistencyScore?.userB || data.comparison.metrics?.consistencyScore?.userB || 0} duration={1.5} />
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">{userB} Consistency</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                                            <CountUp end={data.comparison.impactScore?.userA || data.comparison.metrics?.impactScore?.userA || 0} duration={1.5} />
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">{userA} Impact</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                                            <CountUp end={data.comparison.impactScore?.userB || data.comparison.metrics?.impactScore?.userB || 0} duration={1.5} />
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">{userB} Impact</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function ProfileCard({ profile, username, comparison, side, color }) {
    const userMetrics = side === 'A' ? {
        devScore: comparison?.devScore?.userA || comparison?.metrics?.devScore?.userA || 0,
        repos: comparison?.totalProjects?.userA || comparison?.metrics?.totalProjects?.userA || 0,
        stars: comparison?.totalStars?.userA || comparison?.metrics?.totalStars?.userA || 0,
        commits: comparison?.totalCommits?.userA || comparison?.metrics?.totalCommits?.userA || 0,
    } : {
        devScore: comparison?.devScore?.userB || comparison?.metrics?.devScore?.userB || 0,
        repos: comparison?.totalProjects?.userB || comparison?.metrics?.totalProjects?.userB || 0,
        stars: comparison?.totalStars?.userB || comparison?.metrics?.totalStars?.userB || 0,
        commits: comparison?.totalCommits?.userB || comparison?.metrics?.totalCommits?.userB || 0,
    };

    // Fallback to profile data if metrics are zero
    if (userMetrics.repos === 0 && profile?.publicRepos) {
        userMetrics.repos = profile.publicRepos;
    }
    if (userMetrics.stars === 0 && profile?.repositories) {
        userMetrics.stars = profile.repositories.reduce((sum, r) => sum + (r.stars || 0), 0);
    }
    if (userMetrics.commits === 0 && profile?.contributions) {
        userMetrics.commits = profile.contributions.totalCommits || 0;
    }

    const colorClasses = color === 'blue'
        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
        : 'border-purple-500 bg-purple-50/50 dark:bg-purple-900/10';

    return (
        <motion.div
            initial={{ opacity: 0, x: side === 'A' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`p-8 bg-white dark:bg-gray-900 rounded-2xl border-2 ${colorClasses} h-full`}
        >
            <div className="flex items-center gap-4 mb-6">
                <img
                    src={profile?.avatarUrl}
                    alt={username}
                    className="w-20 h-20 rounded-full border-4 border-gray-200 dark:border-gray-800"
                />
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {profile?.name || username}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">@{username}</p>
                    {profile?.bio && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 line-clamp-2">{profile.bio}</p>
                    )}
                </div>
            </div>
            <div className="space-y-6">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Dev Score</span>
                        <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            <CountUp end={userMetrics.devScore} duration={1.5} />
                        </span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(userMetrics.devScore, 100)}%` }}
                            transition={{ duration: 1.5 }}
                            className={`h-full bg-gradient-to-r ${color === 'blue' ? 'from-blue-500 to-blue-600' : 'from-purple-500 to-purple-600'}`}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            <CountUp end={userMetrics.repos} duration={1.5} />
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Repos</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            <CountUp end={userMetrics.stars} duration={1.5} />
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Stars</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            <CountUp end={userMetrics.commits} duration={1.5} />
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Commits</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function SymmetricMetricBar({ label, valueA, valueB, userA, userB }) {
    const maxValue = Math.max(valueA, valueB, 1);
    const percentageA = (valueA / maxValue) * 100;
    const percentageB = (valueB / maxValue) * 100;
    const winner = valueA > valueB ? 'A' : valueB > valueA ? 'B' : 'tie';

    return (
        <div className="relative">
            <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">{label}</span>
                {winner !== 'tie' && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {winner === 'A' ? userA : userB} leads
                    </span>
                )}
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{userA}</span>
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            <CountUp end={valueA} duration={1.5} />
                        </span>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentageA}%` }}
                            transition={{ duration: 1.5 }}
                            className={`h-full bg-blue-500 ${winner === 'A' ? 'ring-2 ring-blue-300' : ''}`}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{userB}</span>
                        <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                            <CountUp end={valueB} duration={1.5} />
                        </span>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentageB}%` }}
                            transition={{ duration: 1.5 }}
                            className={`h-full bg-purple-500 ${winner === 'B' ? 'ring-2 ring-purple-300' : ''}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
