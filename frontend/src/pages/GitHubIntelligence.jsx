import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Github, Star, GitFork, Code2, TrendingUp, Calendar } from 'lucide-react';
import { githubAPI } from '../services/api';

/**
 * Ultra-clean GitHub Intelligence Page with Real Insights
 * Inspired by ChatGPT, Claude, npm - minimal and premium
 */
export default function GitHubIntelligence() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (username) {
            fetchData();
        }
    }, [username]);

    async function fetchData() {
        try {
            setLoading(true);
            setError(null);
            const response = await githubAPI.analyze(username);
            setData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Analyzing {username}...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
                <div className="text-center max-w-md px-6">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Github className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Error</h2>
                    <p className="text-gray-600 dark:text-gray-400">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    // Check if profile is empty
    const isEmpty = (!data.repositories || data.repositories.length === 0) &&
        (!data.contributions || data.contributions.totalCommits === 0);

    if (isEmpty) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950">
                <div className="max-w-5xl mx-auto px-6 py-12">
                    {/* Header */}
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    {/* Empty State */}
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Github className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                            No Public Activity
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            <span className="font-medium">{username}</span> hasn't created any public repositories yet.
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
                            Try: torvalds, gaearon, tj, sindresorhus
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const stats = data.aiInsights?.gamification?.stats || {};
    const repos = data.repositories || [];
    const activeRepos = repos.filter(r => !r.isArchived);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Profile Header */}
                <div className="mb-16">
                    <div className="flex items-start gap-6 mb-6">
                        <img
                            src={data.profile?.avatarUrl}
                            alt={username}
                            className="w-24 h-24 rounded-full border-2 border-gray-200 dark:border-gray-800"
                        />
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                {data.profile?.name || username}
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                                @{username}
                            </p>
                            {data.profile?.bio && (
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    {data.profile.bio}
                                </p>
                            )}
                            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                                <span>{data.profile?.followers || 0} followers</span>
                                <span>{data.profile?.following || 0} following</span>
                                {data.profile?.location && <span>{data.profile.location}</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    <StatCard
                        label="Repositories"
                        value={repos.length}
                        subtext={`${activeRepos.length} active`}
                    />
                    <StatCard
                        label="Total Stars"
                        value={stats.totalStars || 0}
                    />
                    <StatCard
                        label="Total Commits"
                        value={stats.totalCommits || 0}
                    />
                    <StatCard
                        label="Languages"
                        value={stats.languages || 0}
                    />
                </div>

                {/* Contribution Activity */}
                {data.contributions && data.contributions.totalCommits > 0 && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                            Contribution Activity
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <ActivityCard
                                icon={<TrendingUp className="w-5 h-5" />}
                                label="Total Commits"
                                value={data.contributions.totalCommits}
                                subtext="All time"
                            />
                            <ActivityCard
                                icon={<Calendar className="w-5 h-5" />}
                                label="Current Streak"
                                value={data.contributions.currentStreak || 0}
                                subtext={data.contributions.currentStreak > 0 ? 'days' : 'No active streak'}
                            />
                            <ActivityCard
                                icon={<TrendingUp className="w-5 h-5" />}
                                label="Longest Streak"
                                value={data.contributions.longestStreak || 0}
                                subtext="days"
                            />
                        </div>

                        {/* Simple contribution visualization */}
                        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                {data.contributions.totalCommits.toLocaleString()} contributions in the last year
                            </div>
                            <ContributionGraph contributions={data.contributions} />
                        </div>
                    </div>
                )}

                {/* Top Languages */}
                {data.metrics && data.metrics.skills && Object.keys(data.metrics.skills).length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                            Top Languages
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(data.metrics.skills)
                                .sort(([, a], [, b]) => b.totalBytes - a.totalBytes)
                                .slice(0, 8)
                                .map(([lang, data]) => (
                                    <LanguageCard key={lang} language={lang} repos={data.repos} />
                                ))}
                        </div>
                    </div>
                )}

                {/* Repositories */}
                {repos.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                            Repositories
                        </h2>
                        <div className="space-y-4">
                            {repos.slice(0, 10).map(repo => (
                                <RepoCard key={repo.name} repo={repo} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Clean stat card component
function StatCard({ label, value, subtext }) {
    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {value.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
                {label}
            </div>
            {subtext && (
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {subtext}
                </div>
            )}
        </div>
    );
}

// Clean repository card
function RepoCard({ repo }) {
    return (
        <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
        >
            <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {repo.name}
                </h3>
                {repo.isArchived && (
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                        Archived
                    </span>
                )}
            </div>

            {repo.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {repo.description}
                </p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
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
        </a>
    );
}

// Activity card with icon
function ActivityCard({ icon, label, value, subtext }) {
    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-3">
                <div className="text-blue-600 dark:text-blue-400">
                    {icon}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    {label}
                </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {value.toLocaleString()}
            </div>
            {subtext && (
                <div className="text-xs text-gray-500 dark:text-gray-500">
                    {subtext}
                </div>
            )}
        </div>
    );
}

// Language card
function LanguageCard({ language, repos }) {
    return (
        <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
                <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {language}
                </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
                {repos} {repos === 1 ? 'repo' : 'repos'}
            </div>
        </div>
    );
}

// Simple contribution graph
function ContributionGraph({ contributions }) {
    if (!contributions || !contributions.weeks) return null;

    // Get last 52 weeks
    const weeks = contributions.weeks.slice(-52);

    return (
        <div className="overflow-x-auto">
            <div className="inline-flex gap-1">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                        {week.days.map((day, dayIndex) => {
                            const intensity = day.count === 0 ? 0 :
                                day.count < 3 ? 1 :
                                    day.count < 6 ? 2 :
                                        day.count < 10 ? 3 : 4;

                            const colors = [
                                'bg-gray-100 dark:bg-gray-800',
                                'bg-green-200 dark:bg-green-900',
                                'bg-green-400 dark:bg-green-700',
                                'bg-green-600 dark:bg-green-500',
                                'bg-green-800 dark:bg-green-400'
                            ];

                            return (
                                <div
                                    key={dayIndex}
                                    className={`w-3 h-3 rounded-sm ${colors[intensity]}`}
                                    title={`${day.count} contributions`}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
