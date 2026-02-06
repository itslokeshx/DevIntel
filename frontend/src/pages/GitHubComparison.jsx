import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Star, GitBranch, Code2, TrendingUp, Award, Zap } from 'lucide-react';
import { comparisonAPI } from '../services/api';
import { BattleArenaSetup } from '../components/comparison/BattleArenaSetup';
import { StreamingAIVerdict } from '../components/comparison/StreamingAIVerdict';
import { calculateBattleScore, determineBattleWinner } from '../utils/battleScore';
import CountUp from 'react-countup';

export default function GitHubComparison() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [showBattleStart, setShowBattleStart] = useState(true);
    const [currentSection, setCurrentSection] = useState(0);

    const handleBattleStart = async (fighterA, fighterB) => {
        try {
            setLoading(true);
            setError(null);
            setShowBattleStart(false);

            const response = await comparisonAPI.compare(fighterA, fighterB);
            setData(response.data || response);
            setLoading(false);

            // Start the reveal sequence
            setTimeout(() => setCurrentSection(1), 500);
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
        setCurrentSection(0);
    };

    if (showBattleStart && !data) {
        return <BattleArenaSetup onBattleStart={handleBattleStart} loading={loading} />;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Analyzing profiles...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { userA, userB, comparison, aiInsights } = data;
    const scoreA = calculateBattleScore(userA);
    const scoreB = calculateBattleScore(userB);
    const battleResult = determineBattleWinner(scoreA.total, scoreB.total);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-semibold">Battle Results</h1>
                    <button
                        onClick={handleNewBattle}
                        className="px-4 py-2 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        New Battle
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Contenders Introduction */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
                        The Contenders
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ContenderCard user={userA} score={scoreA} color="blue" />
                        <ContenderCard user={userB} score={scoreB} color="purple" />
                    </div>
                </motion.div>

                {/* Head-to-Head Comparisons */}
                <AnimatePresence>
                    {currentSection >= 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-16"
                        >
                            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
                                Head-to-Head Analysis
                            </h2>
                            <div className="space-y-6">
                                <ComparisonMetric
                                    icon={Trophy}
                                    label="Developer Score"
                                    valueA={comparison?.devScore?.userA || 0}
                                    valueB={comparison?.devScore?.userB || 0}
                                    userA={userA?.username}
                                    userB={userB?.username}
                                    delay={0.2}
                                    onComplete={() => setTimeout(() => setCurrentSection(2), 800)}
                                />
                                <ComparisonMetric
                                    icon={GitBranch}
                                    label="Total Repositories"
                                    valueA={comparison?.totalRepos?.userA || 0}
                                    valueB={comparison?.totalRepos?.userB || 0}
                                    userA={userA?.username}
                                    userB={userB?.username}
                                    delay={0.4}
                                />
                                <ComparisonMetric
                                    icon={Star}
                                    label="Total Stars Earned"
                                    valueA={comparison?.totalStars?.userA || 0}
                                    valueB={comparison?.totalStars?.userB || 0}
                                    userA={userA?.username}
                                    userB={userB?.username}
                                    delay={0.6}
                                />
                                <ComparisonMetric
                                    icon={Code2}
                                    label="Total Commits"
                                    valueA={comparison?.totalCommits?.userA || 0}
                                    valueB={comparison?.totalCommits?.userB || 0}
                                    userA={userA?.username}
                                    userB={userB?.username}
                                    delay={0.8}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* AI Analysis */}
                <AnimatePresence>
                    {currentSection >= 2 && aiInsights?.comparison && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-16"
                        >
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-lg">
                                <StreamingAIVerdict
                                    text={aiInsights.comparison}
                                    onComplete={() => setTimeout(() => setCurrentSection(3), 1000)}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Winner Announcement */}
                <AnimatePresence>
                    {currentSection >= 3 && (
                        <WinnerReveal
                            winner={battleResult.winner}
                            winnerName={battleResult.winner === 'A' ? userA?.username : userB?.username}
                            winnerAvatar={battleResult.winner === 'A' ? userA?.username : userB?.username}
                            loserName={battleResult.winner === 'A' ? userB?.username : userA?.username}
                            margin={battleResult.margin}
                            description={battleResult.description}
                            scoreA={scoreA.total}
                            scoreB={scoreB.total}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function ContenderCard({ user, score, color }) {
    const bgGradient = color === 'blue'
        ? 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10'
        : 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10';

    const borderColor = color === 'blue'
        ? 'border-blue-200 dark:border-blue-800/30'
        : 'border-purple-200 dark:border-purple-800/30';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-gradient-to-br ${bgGradient} border-2 ${borderColor} rounded-2xl p-8 text-center`}
        >
            <img
                src={`https://github.com/${user?.username}.png`}
                alt={user?.username}
                className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white dark:border-gray-800 shadow-xl"
            />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {user?.profile?.name || user?.username}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">@{user?.username}</p>

            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-md">
                <Award className={`w-5 h-5 ${color === 'blue' ? 'text-blue-600' : 'text-purple-600'}`} />
                <span className="font-bold text-2xl text-gray-900 dark:text-gray-100">{score?.total || 0}</span>
                <span className="text-sm text-gray-500">points</span>
            </div>
        </motion.div>
    );
}

function ComparisonMetric({ icon: Icon, label, valueA, valueB, userA, userB, delay, onComplete }) {
    const maxValue = Math.max(valueA, valueB, 1);
    const percentA = (valueA / maxValue) * 100;
    const percentB = (valueB / maxValue) * 100;
    const winner = valueA > valueB ? 'A' : valueB > valueA ? 'B' : 'tie';

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            onAnimationComplete={onComplete}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{label}</h3>
            </div>

            <div className="space-y-4">
                {/* User A */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className={`font-medium ${winner === 'A' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
                            {userA}
                        </span>
                        <span className="font-mono font-bold text-lg text-gray-900 dark:text-gray-100">
                            <CountUp end={valueA} duration={1.5} separator="," />
                        </span>
                    </div>
                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentA}%` }}
                            transition={{ duration: 1, delay: delay + 0.3 }}
                            className={`h-full rounded-full ${winner === 'A' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-400'}`}
                        />
                    </div>
                </div>

                {/* User B */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className={`font-medium ${winner === 'B' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'}`}>
                            {userB}
                        </span>
                        <span className="font-mono font-bold text-lg text-gray-900 dark:text-gray-100">
                            <CountUp end={valueB} duration={1.5} separator="," />
                        </span>
                    </div>
                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentB}%` }}
                            transition={{ duration: 1, delay: delay + 0.3 }}
                            className={`h-full rounded-full ${winner === 'B' ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gray-400'}`}
                        />
                    </div>
                </div>

                {/* Winner indicator */}
                {winner !== 'tie' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: delay + 1.5 }}
                        className="flex justify-center pt-2"
                    >
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${winner === 'A'
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                            }`}>
                            <Zap className="w-3 h-3" />
                            {winner === 'A' ? userA : userB} leads by {Math.abs(valueA - valueB).toLocaleString()}
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

function WinnerReveal({ winner, winnerName, winnerAvatar, loserName, margin, description, scoreA, scoreB }) {
    if (winner === 'TIE') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
            >
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full mb-8">
                    <span className="text-5xl">🤝</span>
                </div>
                <h2 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">Perfect Balance</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Both developers demonstrate exceptional skills in their own unique ways.
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
        >
            {/* Confetti effect placeholder */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: -20, x: Math.random() * 100 + '%', opacity: 0 }}
                        animate={{
                            y: 600,
                            opacity: [0, 1, 0],
                            rotate: Math.random() * 360
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            delay: Math.random() * 0.5,
                            repeat: Infinity,
                            repeatDelay: 2
                        }}
                        className="absolute text-2xl"
                    >
                        {['🎉', '⭐', '🏆', '✨', '💫'][Math.floor(Math.random() * 5)]}
                    </motion.div>
                ))}
            </div>

            <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 dark:from-yellow-900/10 dark:via-orange-900/10 dark:to-yellow-900/10 border-2 border-yellow-300 dark:border-yellow-700/30 rounded-3xl p-16 text-center shadow-2xl relative overflow-hidden">
                {/* Trophy */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', bounce: 0.6, delay: 0.3 }}
                    className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-full mb-8 shadow-2xl"
                >
                    <Trophy className="w-16 h-16 text-white" />
                </motion.div>

                {/* Winner Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-6"
                >
                    <div className="inline-block bg-yellow-200 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest shadow-lg">
                        🏆 Champion
                    </div>
                </motion.div>

                {/* Winner Avatar & Name */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mb-8"
                >
                    <img
                        src={`https://github.com/${winnerAvatar}.png`}
                        alt={winnerName}
                        className="w-40 h-40 rounded-full mx-auto mb-6 border-8 border-white dark:border-gray-800 shadow-2xl"
                    />
                    <h2 className="text-6xl font-black text-gray-900 dark:text-gray-100 mb-4">
                        {winnerName}
                    </h2>
                </motion.div>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
                >
                    {description}
                </motion.p>

                {/* Final Score */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="space-y-4"
                >
                    <div className="inline-flex items-center gap-6 bg-white dark:bg-gray-800 px-10 py-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                            <div className="text-4xl font-black text-yellow-600 dark:text-yellow-400 mb-1">
                                {winner === 'A' ? scoreA : scoreB}
                            </div>
                            <div className="text-sm text-gray-500 font-medium">{winnerName}</div>
                        </div>
                        <div className="text-3xl font-bold text-gray-400">vs</div>
                        <div className="text-center">
                            <div className="text-4xl font-black text-gray-400 mb-1">
                                {winner === 'A' ? scoreB : scoreA}
                            </div>
                            <div className="text-sm text-gray-500 font-medium">{loserName}</div>
                        </div>
                    </div>

                    <div className="text-lg text-gray-600 dark:text-gray-400">
                        Victory margin: <span className="font-bold text-yellow-600 dark:text-yellow-400">{margin} points</span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
