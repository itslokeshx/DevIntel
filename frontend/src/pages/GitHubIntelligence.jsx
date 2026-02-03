import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { githubAPI } from '../services/api';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Loading, SkeletonCard } from '../components/common/Loading';
import { DeveloperOverview } from '../components/github/DeveloperOverview';
import { RepoCard } from '../components/github/RepoCard';
import { GrowthActions } from '../components/github/GrowthActions';

export function GitHubIntelligence() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGitHubData();
    }, [username]);

    const fetchGitHubData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Try to get cached data first
            try {
                const cachedData = await githubAPI.getUser(username);
                setData(cachedData.data);
                setLoading(false);
                return;
            } catch (err) {
                // If no cached data, analyze
                console.log('No cached data, analyzing...');
            }

            // Analyze user
            const result = await githubAPI.analyze(username);
            setData(result.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setLoading(true);
        try {
            const result = await githubAPI.refresh(username);
            setData(result.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 className="text-h2 font-bold text-light-text-primary dark:text-dark-text-primary">
                            Analyzing {username}'s GitHub profile...
                        </h2>
                        <p className="text-body text-light-text-secondary dark:text-dark-text-secondary mt-2">
                            This may take 20-30 seconds
                        </p>
                    </div>
                    <Loading />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card padding="lg" className="text-center">
                        <h2 className="text-h2 font-bold text-accent-error mb-4">Error</h2>
                        <p className="text-body text-light-text-secondary dark:text-dark-text-secondary mb-6">
                            {error}
                        </p>
                        <Button onClick={() => navigate('/')}>
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            Back to Home
                        </Button>
                    </Card>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button variant="ghost" onClick={() => navigate('/')}>
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Back
                    </Button>

                    <Button variant="secondary" onClick={handleRefresh}>
                        <RefreshCw className="mr-2 h-5 w-5" />
                        Refresh Data
                    </Button>
                </div>

                {/* Developer Overview */}
                <DeveloperOverview data={data} />

                {/* Growth Actions */}
                {data.aiInsights?.growthActions && (
                    <div className="mt-8">
                        <GrowthActions actions={data.aiInsights.growthActions} />
                    </div>
                )}

                {/* Projects */}
                <div className="mt-12">
                    <h2 className="text-h2 font-bold text-light-text-primary dark:text-dark-text-primary mb-6">
                        Projects ({data.repositories?.length || 0})
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.repositories?.slice(0, 20).map((repo, index) => (
                            <RepoCard key={index} repo={repo} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
