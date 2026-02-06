import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Trophy, Zap, GitBranch, Star, Code2, Activity } from 'lucide-react';
import { comparisonAPI } from '../services/api';
import { RacingBars } from '../components/comparison/RacingBars';
import { TechVennDiagram } from '../components/comparison/TechVennDiagram';
import { ActivityRadarChart } from '../components/comparison/ActivityRadarChart';
import { BattleArenaSetup } from '../components/comparison/BattleArenaSetup';
import { StreamingAIVerdict } from '../components/comparison/StreamingAIVerdict';
import { WinnerAnnouncement } from '../components/comparison/WinnerAnnouncement';
import { calculateBattleScore, determineBattleWinner } from '../utils/battleScore';
import { CompactAchievementBadges } from '../components/gamification/AchievementBadges';
import { GlobalRankingTease } from '../components/gamification/GlobalRankingTease';

export default function GitHubComparison() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [showBattleStart, setShowBattleStart] = useState(true);
    const [streamingComplete, setStreamingComplete] = useState(false);

    const handleBattleStart = async (fighterA, fighterB) => {
        try {
            setLoading(true);
            setError(null);
            setShowBattleStart(false);

            const response = await comparisonAPI.compare(fighterA, fighterB);
            console.log('📊 Comparison API Response:', response);

            setData(response.data || response);
            setLoading(false);
        } catch (err) {
            console.error('Comparison error:', err);
            setError(err.message || 'Failed to compare users');
            setLoading(false);
            setShowBattleStart(true);
        }
    };

    const handleNewBattle = () => {
        setData(null);
        setShowBattleStart(true);
        setError(null);
    };

    // Show battle setup if no data
    if (showBattleStart && !data) {
        return <BattleArenaSetup onBattleStart={handleBattleStart} />;
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
                    />
                    <h2 className="text-3xl font-bold text-white mb-2">Analyzing Fighters...</h2>
                    <p className="text-gray-400">Crunching the numbers</p>
                </motion.div>
            </div>
        );
    }

    if (!data) return null;

    const { userA, userB, comparison, aiInsights } = data;

    // Calculate battle scores
    const scoreA = calculateBattleScore(userA);
    const scoreB = calculateBattleScore(userB);
    const battleResult = determineBattleWinner(scoreA.total, scoreB.total);

    // Extract tech stacks
    const techStackA = userA?.repositories?.map(r => r.language).filter(Boolean) || [];
    const techStackB = userB?.repositories?.map(r => r.language).filter(Boolean) || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-lg border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Home
                        </button>
                        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                            ⚔️ BATTLE ARENA
                        </h1>
                        <button
                            onClick={handleNewBattle}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all"
                        >
                            New Battle
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                {/* Fighter Profiles */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    {/* Fighter A */}
                    <FighterCard
                        user={userA}
                        score={scoreA}
                        color="blue"
                        isWinner={battleResult.winner === 'A'}
                    />

                    {/* Fighter B */}
                    <FighterCard
                        user={userB}
                        score={scoreB}
                        color="purple"
                        isWinner={battleResult.winner === 'B'}
                    />
                </motion.div>

                {/* AI Verdict with Streaming */}
                {aiInsights?.comparison && (
                    <StreamingAIVerdict
                        text={aiInsights.comparison}
                        onComplete={() => setStreamingComplete(true)}
                    />
                )}

                {/* Head-to-Head Metrics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
                >
                    <h2 className="text-3xl font-bold mb-8 text-center">📊 HEAD-TO-HEAD METRICS</h2>
                    <div className="space-y-8">
                        <RacingBars
                            label="Dev Score"
                            valueA={comparison?.devScore?.userA || 0}
                            valueB={comparison?.devScore?.userB || 0}
                            userA={userA?.username}
                            userB={userB?.username}
                            icon={Trophy}
                        />
                        <RacingBars
                            label="Repositories"
                            valueA={comparison?.totalRepos?.userA || 0}
                            valueB={comparison?.totalRepos?.userB || 0}
                            userA={userA?.username}
                            userB={userB?.username}
                            icon={GitBranch}
                        />
                        <RacingBars
                            label="Total Stars"
                            valueA={comparison?.totalStars?.userA || 0}
                            valueB={comparison?.totalStars?.userB || 0}
                            userA={userA?.username}
                            userB={userB?.username}
                            icon={Star}
                        />
                        <RacingBars
                            label="Total Commits"
                            valueA={comparison?.totalCommits?.userA || 0}
                            valueB={comparison?.totalCommits?.userB || 0}
                            userA={userA?.username}
                            userB={userB?.username}
                            icon={Code2}
                        />
                    </div>
                </motion.div>

                {/* Tech Stack Venn Diagram */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
                >
                    <h2 className="text-3xl font-bold mb-8 text-center">🎯 TECH STACK OVERLAP</h2>
                    <TechVennDiagram
                        techStackA={techStackA}
                        techStackB={techStackB}
                        userA={userA?.username}
                        userB={userB?.username}
                    />
                </motion.div>

                {/* Activity Radar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
                >
                    <h2 className="text-3xl font-bold mb-8 text-center">📈 ACTIVITY ANALYSIS</h2>
                    <ActivityRadarChart
                        userAData={userA}
                        userBData={userB}
                        userA={userA?.username}
                        userB={userB?.username}
                    />
                </motion.div>

                {/* Winner Announcement with Confetti */}
                {streamingComplete && (
                    <WinnerAnnouncement
                        winner={battleResult.winner}
                        winnerName={battleResult.winner === 'A' ? userA?.username : userB?.username}
                        margin={battleResult.margin}
                        description={battleResult.description}
                    />
                )}
            </div>
        </div>
    );
}

// Fighter Card Component
function FighterCard({ user, score, color, isWinner }) {
    const colorClasses = color === 'blue'
        ? 'from-blue-600 to-blue-800 border-blue-500'
        : 'from-purple-600 to-purple-800 border-purple-500';

    const ringColor = color === 'blue' ? 'border-blue-500' : 'border-purple-500';

    return (
        <div className={`relative bg-gradient-to-br ${colorClasses} border-2 rounded-2xl p-6 overflow-hidden`}>
            {/* Winner badge */}
            {isWinner && (
                <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', bounce: 0.6 }}
                    className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 z-10"
                >
                    <Trophy className="w-4 h-4" />
                    WINNER
                </motion.div>
            )}

            {/* Avatar */}
            <div className="flex justify-center mb-4">
                <div className={`w-32 h-32 rounded-full border-4 ${ringColor} overflow-hidden bg-gray-900`}>
                    <img
                        src={`https://github.com/${user?.username}.png`}
                        alt={user?.username}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* User info */}
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-1">{user?.profile?.name || user?.username}</h3>
                <p className="text-white/70">@{user?.username}</p>
                {user?.profile?.bio && (
                    <p className="text-sm text-white/60 mt-2 line-clamp-2">{user?.profile?.bio}</p>
                )}

                {/* Achievements */}
                {user?.achievements && user.achievements.length > 0 && (
                    <div className="mt-3">
                        <CompactAchievementBadges achievements={user.achievements} maxDisplay={3} />
                    </div>
                )}
            </div>

            {/* Battle Score */}
            <div className="mb-6 text-center bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="text-sm text-white/70 mb-2">Battle Score</div>
                <div className="text-6xl font-black text-white mb-2">{score?.total || 0}</div>
                <div className="text-xs text-white/60">/ 100 points</div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-2 mb-4">
                <div className="text-xs text-white/70 mb-3 text-center font-semibold">Score Breakdown</div>
                <ScoreBreakdownBar label="Repos" value={score?.breakdown?.repos || 0} max={20} />
                <ScoreBreakdownBar label="Stars" value={score?.breakdown?.stars || 0} max={25} />
                <ScoreBreakdownBar label="Commits" value={score?.breakdown?.commits || 0} max={25} />
                <ScoreBreakdownBar label="Consistency" value={score?.breakdown?.consistency || 0} max={15} />
                <ScoreBreakdownBar label="Docs" value={score?.breakdown?.docs || 0} max={15} />
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-2">
                    <div className="text-lg font-bold text-white">{user?.repositories?.length || 0}</div>
                    <div className="text-xs text-white/70">Repos</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-2">
                    <div className="text-lg font-bold text-white">
                        {user?.repositories?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0}
                    </div>
                    <div className="text-xs text-white/70">Stars</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-2">
                    <div className="text-lg font-bold text-white">
                        {Math.floor((user?.contributions?.totalCommits || 0) / 1000)}k
                    </div>
                    <div className="text-xs text-white/70">Commits</div>
                </div>
            </div>
        </div>
    );
}

// Score Breakdown Bar Component
function ScoreBreakdownBar({ label, value, max }) {
    const percentage = (value / max) * 100;

    return (
        <div className="flex items-center gap-2">
            <div className="text-xs text-white/70 w-20">{label}</div>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-white/60 to-white/90 rounded-full"
                />
            </div>
            <div className="text-xs text-white font-semibold w-8 text-right">{value}/{max}</div>
        </div>
    );
}

