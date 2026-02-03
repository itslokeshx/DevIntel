import React, { useState } from 'react';
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { ComparisonHeader } from '../components/comparison/ComparisonHeader';
import { ProfileComparison } from '../components/comparison/ProfileComparison';
import { MetricsComparison } from '../components/comparison/MetricsComparison';
import { TechStackOverlap } from '../components/comparison/TechStackOverlap';
import { comparisonAPI } from '../services/api';

export default function GitHubComparison() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const handleCompare = async (userA, userB) => {
        try {
            setLoading(true);
            setError(null);

            const response = await comparisonAPI.compare(userA, userB);
            setData(response.data);

            setLoading(false);
        } catch (err) {
            console.error('Comparison error:', err);
            setError(err.message || 'Failed to compare users');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Back Button */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Button>
                </div>

                {/* Header / Input Form */}
                <ComparisonHeader onCompare={handleCompare} loading={loading} />

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <p className="text-red-700 dark:text-red-300">{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-12">
                        <Loading text="Analyzing and comparing profiles..." />
                    </div>
                )}

                {/* Results */}
                {data && !loading && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Profile Cards Side-by-Side */}
                        <ProfileComparison
                            userA={data.userA}
                            userB={data.userB}
                        />

                        {/* AI Analysis Card */}
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800 mb-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Sparkles className="w-24 h-24" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-3 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    AI Comparative Verdict
                                </h3>
                                <p className="text-indigo-800 dark:text-indigo-200 leading-relaxed">
                                    {data.comparison.aiVerdict}
                                </p>
                            </div>
                        </div>

                        {/* Metrics and Tech Stack Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                            <div className="lg:col-span-2">
                                <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm border border-light-border dark:border-dark-border p-6">
                                    <MetricsComparison metrics={data.comparison} />
                                </div>
                            </div>
                            <div className="lg:col-span-1">
                                <TechStackOverlap techStack={data.comparison.techStack} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
