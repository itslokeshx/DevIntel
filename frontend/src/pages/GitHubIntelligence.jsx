import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { githubAPI } from '../services/api';
import DeveloperOverview from '../components/github/DeveloperOverview';
import ProjectCard from '../components/github/ProjectCard';
import { ContributionHeatmap } from '../components/github/ContributionHeatmap';
import { ActivityTimeline } from '../components/github/ActivityTimeline';
import { SkillRadar } from '../components/github/SkillRadar';
import { RepoFilters } from '../components/github/RepoFilters';
import { GamificationDashboard } from '../components/gamification/GamificationDashboard';
import { DeveloperInsights } from '../components/github/DeveloperInsights';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { Card } from '../components/common/Card';

export default function GitHubIntelligence() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAllRepos, setShowAllRepos] = useState(false);

    // Filter and sort state
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('updated');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchGitHubData();
    }, [username]);

    async function fetchGitHubData() {
        try {
            setLoading(true);
            setError(null);

            // Always analyze fresh - no caching
            console.log('Analyzing user...');
            const response = await githubAPI.analyze(username);
            setData(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching GitHub data:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch data');
            setLoading(false);
        }
    }

    async function handleRefresh() {
        try {
            setLoading(true);
            setError(null);
            const response = await githubAPI.analyze(username);
            setData(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error refreshing data:', err);
            setError(err.response?.data?.message || err.message || 'Failed to refresh data');
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark py-12">
                <div className="container mx-auto px-4">
                    <Loading text="Analyzing GitHub profile..." />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark py-12">
                <div className="container mx-auto px-4 max-w-2xl">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
                        <p className="text-red-800 dark:text-red-200 mb-4">{error}</p>
                        <Button onClick={() => navigate('/')}>
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    // Filter repositories
    let filteredRepos = [...(data.repositories || [])];

    // Apply filter
    if (filter === 'active') {
        filteredRepos = filteredRepos.filter(r => r.maturityStage === 'active');
    } else if (filter === 'stable') {
        filteredRepos = filteredRepos.filter(r => r.maturityStage === 'stable');
    } else if (filter === 'archived') {
        filteredRepos = filteredRepos.filter(r => r.isArchived);
    }

    // Apply search
    if (searchQuery) {
        filteredRepos = filteredRepos.filter(r =>
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Apply sorting
    filteredRepos.sort((a, b) => {
        switch (sortBy) {
            case 'updated':
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            case 'created':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'stars':
                return (b.stars || 0) - (a.stars || 0);
            case 'commits':
                return (b.commitCount || 0) - (a.commitCount || 0);
            case 'quality':
                return (b.healthScore || 0) - (a.healthScore || 0);
            default:
                return 0;
        }
    });

    // Get top 5 repos for initial view
    const topRepos = filteredRepos.slice(0, 5);
    const displayedRepos = showAllRepos ? filteredRepos : topRepos;
    const hiddenReposCount = filteredRepos.length - topRepos.length;

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Data
                    </Button>
                </div>

                {/* Developer Overview */}
                <DeveloperOverview data={data} />

                {/* Gamification Dashboard */}
                {data.aiInsights?.gamification && (
                    <div className="mt-8">
                        <GamificationDashboard gamification={data.aiInsights.gamification} />
                    </div>
                )}

                {/* AI-Powered Developer Insights */}
                {data.aiInsights?.personality && data.aiInsights?.growthTrajectory && (
                    <div className="mt-8">
                        <DeveloperInsights
                            personality={data.aiInsights.personality}
                            growthTrajectory={data.aiInsights.growthTrajectory}
                        />
                    </div>
                )}

                {/* Visualizations Section */}
                <div className="mt-8 space-y-8">
                    {/* Contribution Heatmap */}
                    <Card>
                        <ContributionHeatmap contributions={data.contributions} />
                    </Card>

                    {/* Activity Timeline and Skill Radar */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <ActivityTimeline contributions={data.contributions} />
                        </Card>
                        <Card>
                            <SkillRadar metrics={data.metrics} repositories={data.repositories} />
                        </Card>
                    </div>
                </div>

                {/* Projects Section */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
                        🚀 Projects
                    </h2>

                    {/* Repository Filters */}
                    <RepoFilters
                        repositories={data.repositories || []}
                        filter={filter}
                        setFilter={setFilter}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />

                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                            Showing {displayedRepos.length} {displayedRepos.length === 1 ? 'repository' : 'repositories'}
                            {!showAllRepos && filteredRepos.length > 5 && ` of ${filteredRepos.length}`}
                        </p>
                        {hiddenReposCount > 0 && (
                            <Button
                                variant="outline"
                                onClick={() => setShowAllRepos(!showAllRepos)}
                                className="flex items-center gap-2"
                            >
                                {showAllRepos ? (
                                    <>
                                        Show Less
                                        <ChevronUp className="w-4 h-4" />
                                    </>
                                ) : (
                                    <>
                                        View All ({hiddenReposCount} more)
                                        <ChevronDown className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {displayedRepos.map((repo, index) => (
                            <ProjectCard key={repo._id || index} repo={repo} />
                        ))}
                    </div>

                    {displayedRepos.length === 0 && (
                        <div className="text-center py-12 text-text-tertiary-light dark:text-text-tertiary-dark">
                            No repositories found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
