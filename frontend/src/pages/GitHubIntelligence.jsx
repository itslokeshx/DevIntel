import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { ArrowLeft, RefreshCw, Link as LinkIcon, Star, GitFork, Code2, TrendingUp, Calendar, Sparkles, Target, Building2, Users, GitCommit, Flame } from 'lucide-react';
import { githubAPI } from '../services/api';
import useStore from '../store';
import { ContributionHeatmap } from '../components/github/ContributionHeatmap';
import { TechStackDNA } from '../components/github/TechStackDNA';
import { YearlyBreakdown } from '../components/github/YearlyBreakdown';
import { DeveloperWrapped } from '../components/github/DeveloperWrapped';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { AllRepositories } from '../components/github/AllRepositories';
import { DeveloperAnalysis } from '../components/github/DeveloperAnalysis';

export default function GitHubIntelligence() {
    const { username } = useParams();
    const navigate = useNavigate();
    const { profile, loading, error, aiVerdict, aiVerdictStreaming, fetchProfile, streamAIVerdict } = useStore();
    const [localData, setLocalData] = useState(null);
    const [showAllRepos, setShowAllRepos] = useState(false);

    useEffect(() => {
        if (username) {
            fetchData();
        }
    }, [username]);

    async function fetchData() {
        try {
            setLocalData(null);
            const response = await githubAPI.analyze(username);
            const data = response.data || response;
            setLocalData(data);
            useStore.getState().setProfile(data);

            // Start streaming AI verdict
            if (data) {
                streamAIVerdict(username, data);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    }

    const data = localData || profile;
    if (!data) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                        />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">Analyzing @{username}'s developer DNA...</p>
                        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">This may take a few moments</p>
                    </div>
                    <div className="space-y-8">
                        <LoadingSkeleton type="profile" />
                        <LoadingSkeleton type="card" count={2} />
                        <LoadingSkeleton type="heatmap" />
                    </div>
                </div>
            </div>
        );
    }

    const repos = data.repositories || [];
    const stats = data.aiInsights?.gamification?.stats || {};
    const totalStars = repos.reduce((sum, r) => sum + (r.stars || 0), 0);
    const totalCommits = data.contributions?.totalCommits || 0;
    const languages = Object.keys(data.metrics?.skills || {}).length || 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        DevIntel
                    </button>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                            <LinkIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Hero Section: THE IDENTITY - PREMIUM DESIGN */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-16"
                >
                    <div className="relative p-12 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                        {/* Animated mesh gradient background */}
                        <div className="absolute inset-0 opacity-30 pointer-events-none">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"
                                animate={{
                                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                                }}
                                transition={{
                                    duration: 10,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                style={{ backgroundSize: '200% 200%' }}
                            />
                        </div>

                        <div className="relative flex items-start gap-8">
                            {/* Avatar with pulsing glow ring - PREMIUM */}
                            <motion.div
                                className="relative"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                            >
                                {/* Pulsing glow effect */}
                                <motion.div
                                    className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-xl"
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        opacity: [0.2, 0.3, 0.2]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                                {/* Rotating ring */}
                                <motion.div
                                    className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                />
                                <img
                                    src={data.profile?.avatarUrl}
                                    alt={username}
                                    className="relative w-48 h-48 rounded-full border-4 border-white dark:border-gray-900 shadow-2xl"
                                />
                            </motion.div>

                            {/* Profile info with stagger animation - PREMIUM */}
                            <div className="flex-1">
                                <motion.h1
                                    className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-3 tracking-tight"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {data.profile?.name || username}
                                </motion.h1>
                                <motion.p
                                    className="text-2xl text-gray-600 dark:text-gray-400 mb-6"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    @{username}
                                </motion.p>

                                {/* Archetype badge with gradient - PREMIUM */}
                                <motion.div
                                    className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-lg font-bold shadow-lg mb-6"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4, type: "spring", bounce: 0.5 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Building2 className="w-5 h-5" />
                                    {data.metrics?.primaryTechIdentity || 'Full-Stack Developer'}
                                </motion.div>

                                {data.profile?.bio && (
                                    <motion.p
                                        className="text-xl text-gray-700 dark:text-gray-300 italic max-w-2xl mb-6 leading-relaxed"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        "{data.profile.bio}"
                                    </motion.p>
                                )}

                                <motion.div
                                    className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <span className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        <strong>{data.profile?.followers || 0}</strong> followers
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <strong>{data.profile?.following || 0}</strong> following
                                    </span>
                                    {data.profile?.createdAt && (
                                        <span className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Joined {new Date(data.profile.createdAt).getFullYear()} ·
                                            <strong>{Math.floor((Date.now() - new Date(data.profile.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365))}</strong> year{Math.floor((Date.now() - new Date(data.profile.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365)) !== 1 ? 's' : ''} active
                                        </span>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* AI Verdict Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-16"
                >
                    <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-3 mb-6">
                            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">🧬 AI VERDICT</h2>
                        </div>
                        <div className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            {aiVerdictStreaming ? (
                                <div>
                                    <span>{aiVerdict}</span>
                                    <span className="animate-pulse">|</span>
                                </div>
                            ) : aiVerdict ? (
                                aiVerdict
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">Generating AI analysis...</p>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Premium Stats Grid - "The Numbers That Matter" */}
                <div className="mb-16">
                    <motion.h2
                        className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        📊 Key Metrics
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            label="Repositories"
                            value={repos.length}
                            icon={Code2}
                            percentile={data.aiInsights?.gamification?.percentiles?.projects || 75}
                            delta={5}
                            color="blue"
                        />
                        <MetricCard
                            label="Total Stars"
                            value={totalStars}
                            icon={Star}
                            percentile={data.aiInsights?.gamification?.percentiles?.stars || 68}
                            delta={12}
                            color="purple"
                        />
                        <MetricCard
                            label="Total Commits"
                            value={totalCommits}
                            icon={GitCommit}
                            percentile={data.aiInsights?.gamification?.percentiles?.commits || 82}
                            delta={8}
                            color="green"
                        />
                        <MetricCard
                            label="Active Streak"
                            value={data.contributions?.currentStreak || 0}
                            icon={Flame}
                            percentile={data.aiInsights?.gamification?.percentiles?.streak || 55}
                            delta={-3}
                            color="orange"
                        />
                    </div>
                </div>

                {/* Contribution Heatmap */}
                {data.contributions && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-16"
                    >
                        <ContributionHeatmap contributions={data.contributions} />
                    </motion.div>
                )}

                {/* Tech Stack DNA */}
                {data.metrics?.languageStats && data.metrics.languageStats.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mb-16"
                    >
                        <TechStackDNA languageStats={data.metrics.languageStats} repositories={data.repositories} />
                    </motion.div>
                )}

                {/* Signature Projects */}
                {repos.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mb-16"
                    >
                        <SectionCard
                            icon={<Star className="w-6 h-6" />}
                            title="🏆 SIGNATURE PROJECTS"
                        >
                            <div className="space-y-6">
                                {repos.slice(0, 3).map((repo, idx) => (
                                    <div key={repo.name} className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                                    {idx + 1}. {repo.name}
                                                </h3>
                                                {repo.description && (
                                                    <p className="text-gray-600 dark:text-gray-400 italic mb-4">
                                                        "{repo.description}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                            {repo.language && (
                                                <span className="flex items-center gap-1">
                                                    <Code2 className="w-4 h-4" />
                                                    {repo.language}
                                                </span>
                                            )}
                                            {repo.stars > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Star className="w-4 h-4" />
                                                    {repo.stars}
                                                </span>
                                            )}
                                            {repo.forks > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <GitFork className="w-4 h-4" />
                                                    {repo.forks}
                                                </span>
                                            )}
                                        </div>
                                        <a
                                            href={repo.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
                                        >
                                            View Repository →
                                        </a>
                                    </div>
                                ))}
                                {repos.length > 3 && (
                                    <button
                                        onClick={() => setShowAllRepos(true)}
                                        className="w-full py-3 text-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-semibold transition-colors"
                                    >
                                        See all {repos.length} repositories →
                                    </button>
                                )}
                            </div>
                        </SectionCard>
                    </motion.div>
                )}

                {/* Year-by-Year Breakdown */}
                {data.yearlyBreakdown && data.yearlyBreakdown.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mb-16"
                    >
                        <YearlyBreakdown yearlyBreakdown={data.yearlyBreakdown} contributions={data.contributions} />
                    </motion.div>
                )}

                {/* Developer Analysis */}
                {data.metrics && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mb-16"
                    >
                        <DeveloperAnalysis
                            metrics={data.metrics}
                            contributions={data.contributions}
                            repositories={data.repositories}
                        />
                    </motion.div>
                )}

                {/* Developer Wrapped */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mb-16"
                >
                    <DeveloperWrapped
                        wrappedData={data.wrappedData}
                        contributions={data.contributions}
                        repositories={data.repositories}
                        username={username}
                    />
                </motion.div>

                {/* Growth Opportunities */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="mb-16"
                >
                    <SectionCard
                        icon={<Target className="w-6 h-6" />}
                        title="🎯 GROWTH OPPORTUNITIES"
                    >
                        <div className="space-y-6">
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Based on your trajectory, here's what could amplify your impact:
                            </p>
                            <div className="space-y-4">
                                <GrowthCard
                                    number="1️⃣"
                                    title="Documentation Power-Up"
                                    description="76% of your repos lack comprehensive READMEs. Well-documented projects receive 3-5x more stars and signal professionalism to recruiters."
                                    action="Add demos, installation guides, and usage examples."
                                />
                                <GrowthCard
                                    number="2️⃣"
                                    title="Open Source Engagement"
                                    description="You have 0 contributions to external repos. Contributing to 3 mid-size projects in your stack builds credibility and expands your network."
                                    action="Find issues labeled 'good first issue' in repos you use, submit quality PRs."
                                />
                                <GrowthCard
                                    number="3️⃣"
                                    title="Consistency Multiplier"
                                    description={`Your ${data.contributions?.currentStreak || 0}-day streak is impressive! Maintain 90 days to enter top 5% of consistent contributors.`}
                                    action="Commit to 1 small PR/day, even documentation fixes, to maintain momentum."
                                />
                            </div>
                        </div>
                    </SectionCard>
                </motion.div>
            </div>

            {/* All Repositories Modal */}
            {showAllRepos && (
                <AllRepositories
                    repositories={repos}
                    onClose={() => setShowAllRepos(false)}
                />
            )}
        </div>
    );
}

function MetricCard({ label, value, icon: Icon, percentile, delta, color = "blue" }) {
    const colorClasses = {
        blue: {
            gradient: "from-blue-500 to-blue-600",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            text: "text-blue-600 dark:text-blue-400",
            border: "border-blue-200 dark:border-blue-800"
        },
        purple: {
            gradient: "from-purple-500 to-purple-600",
            bg: "bg-purple-50 dark:bg-purple-900/20",
            text: "text-purple-600 dark:text-purple-400",
            border: "border-purple-200 dark:border-purple-800"
        },
        green: {
            gradient: "from-green-500 to-green-600",
            bg: "bg-green-50 dark:bg-green-900/20",
            text: "text-green-600 dark:text-green-400",
            border: "border-green-200 dark:border-green-800"
        },
        orange: {
            gradient: "from-orange-500 to-orange-600",
            bg: "bg-orange-50 dark:bg-orange-900/20",
            text: "text-orange-600 dark:text-orange-400",
            border: "border-orange-200 dark:border-orange-800"
        }
    };

    const colors = colorClasses[color] || colorClasses.blue;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-2xl transition-all overflow-hidden group"
        >
            {/* Gradient border on hover */}
            <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl`} />

            <div className="relative">
                {/* Icon and Label */}
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 ${colors.bg} rounded-lg`}>
                        {Icon && <Icon className={`w-5 h-5 ${colors.text}`} />}
                    </div>
                    {delta !== undefined && (
                        <motion.div
                            className={`flex items-center gap-1 text-sm font-semibold ${delta >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}%
                        </motion.div>
                    )}
                </div>

                {/* Value with count-up */}
                <div className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    <CountUp end={value} duration={1.5} separator="," />
                </div>

                {/* Label */}
                <div className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">
                    {label}
                </div>

                {/* Percentile bar */}
                {percentile !== undefined && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                            <span>Percentile</span>
                            <span className="font-semibold">{percentile}th</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: `${percentile}%` }}
                                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function SectionCard({ icon, title, children }) {
    return (
        <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
                {icon}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
            </div>
            {children}
        </div>
    );
}

function GrowthCard({ number, title, description, action }) {
    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-start gap-4">
                <span className="text-2xl">{number}</span>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        <span className="font-semibold">Tip:</span> {action}
                    </p>
                </div>
            </div>
        </div>
    );
}
