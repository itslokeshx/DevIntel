import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, GitBranch, Star, Code2, Trophy } from 'lucide-react';
import { comparisonAPI } from '../services/api';
import { RacingBars } from '../components/comparison/RacingBars';
import { TechVennDiagram } from '../components/comparison/TechVennDiagram';
import { ActivityRadarChart } from '../components/comparison/ActivityRadarChart';
import { BattleArenaSetup } from '../components/comparison/BattleArenaSetup';
import { StreamingAIVerdict } from '../components/comparison/StreamingAIVerdict';
import { WinnerAnnouncement } from '../components/comparison/WinnerAnnouncement';
import { calculateBattleScore, determineBattleWinner } from '../utils/battleScore';
import { CompactAchievementBadges } from '../components/gamification/AchievementBadges';

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
    const techStackA = userA?.repositories?.map(r => r.language).filter(Boolean) || [];
    const techStackB = userB?.repositories?.map(r => r.language).filter(Boolean) || [];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
            {/* Header - Clean Glassmorphism */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-lg font-semibold">Comparison Report</h1>
                    </div>
                    <button
                        onClick={handleNewBattle}
                        className="px-4 py-2 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        New Comparison
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Profiles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileCard
                        user={userA}
                        score={scoreA}
                        isWinner={battleResult.winner === 'A'}
                        highlight="blue"
                    />
                    <ProfileCard
                        user={userB}
                        score={scoreB}
                        isWinner={battleResult.winner === 'B'}
                        highlight="purple"
                    />
                </div>

                {/* AI Analysis - Clean Card */}
                {aiInsights?.comparison && (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm">
                        <StreamingAIVerdict
                            text={aiInsights.comparison}
                            onComplete={() => setStreamingComplete(true)}
                        />
                    </div>
                )}

                {/* Grid Layout for Visualizations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Metrics Comparison */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold mb-6">Key Metrics</h3>
                        <div className="space-y-6">
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
                    </div>

                    {/* Tech Stack */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm flex flex-col">
                        <h3 className="text-lg font-semibold mb-6">Tech Overlap</h3>
                        <div className="flex-1 flex items-center justify-center">
                            <TechVennDiagram
                                techStackA={techStackA}
                                techStackB={techStackB}
                                userA={userA?.username}
                                userB={userB?.username}
                            />
                        </div>
                    </div>

                    {/* Radar Chart - Full Width on Mobile, Half on Desktop */}
                    <div className="md:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold">Activity Profile</h3>
                        </div>
                        <div className="h-[400px] flex items-center justify-center">
                            <ActivityRadarChart
                                userAData={userA}
                                userBData={userB}
                                userA={userA?.username}
                                userB={userB?.username}
                            />
                        </div>
                    </div>
                </div>

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

function ProfileCard({ user, score, isWinner, highlight }) {
    const borderColor = isWinner
        ? highlight === 'blue' ? 'border-blue-500' : 'border-purple-500'
        : 'border-transparent';

    return (
        <div className={`relative bg-white dark:bg-gray-800 rounded-xl p-6 border-2 ${borderColor} shadow-sm transition-all`}>
            {isWinner && (
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">
                    <Trophy className="w-3 h-3" />
                    WINNER
                </div>
            )}

            <div className="flex items-start gap-4">
                <img
                    src={`https://github.com/${user?.username}.png`}
                    alt={user?.username}
                    className="w-20 h-20 rounded-full border-2 border-gray-100 dark:border-gray-700"
                />
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{user?.profile?.name || user?.username}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">@{user?.username}</p>

                    {user?.achievements?.length > 0 && (
                        <div className="mt-3">
                            <CompactAchievementBadges achievements={user.achievements} maxDisplay={3} />
                        </div>
                    )}
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{score?.total || 0}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Score</div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
                <StatBox label="Repos" value={user?.repositories?.length || 0} />
                <StatBox label="Stars" value={user?.repositories?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0} />
                <StatBox label="Commits" value={Math.floor((user?.contributions?.totalCommits || 0) / 1000) + 'k'} />
                <StatBox label="Followers" value={user?.profile?.followers || 0} />
            </div>
        </div>
    );
}

function StatBox({ label, value }) {
    return (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="font-semibold text-gray-900 dark:text-gray-100">{value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
        </div>
    );
}
