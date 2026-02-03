import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Code, Trophy, FileText, ArrowRight, GitCompare } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export function Home() {
    const navigate = useNavigate();
    const [githubUsername, setGithubUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!githubUsername.trim()) {
            setError('GitHub username is required');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // Navigate to GitHub Intelligence page
            navigate(`/github/${githubUsername.trim()}`);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleCompare = () => {
        navigate('/compare');
    };

    return (
        <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center space-y-6">
                    <h1 className="text-hero font-bold text-light-text-primary dark:text-dark-text-primary">
                        Understand developers through their actual work
                    </h1>

                    <p className="text-h3 text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
                        DevIntel analyzes public GitHub activity to reveal patterns, skills, and growth potential
                    </p>
                </div>

                {/* Input Form */}
                <Card className="mt-12 max-w-md mx-auto" padding="lg">
                    <div className="space-y-4">
                        <Input
                            label="GitHub Username"
                            type="text"
                            icon={Github}
                            placeholder="octocat"
                            value={githubUsername}
                            onChange={(e) => setGithubUsername(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                            error={error}
                            required
                        />

                        <Button
                            variant="primary"
                            size="lg"
                            className="w-full"
                            onClick={handleAnalyze}
                            loading={loading}
                            disabled={!githubUsername.trim()}
                        >
                            Analyze with DevIntel
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>

                        <Button
                            variant="secondary"
                            size="md"
                            className="w-full"
                            onClick={handleCompare}
                        >
                            <GitCompare className="mr-2 h-5 w-5" />
                            Compare GitHub Profiles
                        </Button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-small text-light-text-secondary dark:text-dark-text-secondary">
                            🔒 Public data only • No login needed
                        </p>
                    </div>
                </Card>

                {/* Feature Highlights */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-primary/10 dark:bg-accent-primary-dark/10">
                            <Code className="h-6 w-6 text-accent-primary dark:text-accent-primary-dark" />
                        </div>
                        <h3 className="text-h3 font-semibold text-light-text-primary dark:text-dark-text-primary">
                            Intelligence over statistics
                        </h3>
                        <p className="text-body text-light-text-secondary dark:text-dark-text-secondary">
                            See patterns and insights, not just numbers
                        </p>
                    </div>

                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-secondary/10 dark:bg-accent-secondary-dark/10">
                            <Trophy className="h-6 w-6 text-accent-secondary dark:text-accent-secondary-dark" />
                        </div>
                        <h3 className="text-h3 font-semibold text-light-text-primary dark:text-dark-text-primary">
                            AI-powered insights
                        </h3>
                        <p className="text-body text-light-text-secondary dark:text-dark-text-secondary">
                            Get personalized recommendations for growth
                        </p>
                    </div>

                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-warning/10">
                            <FileText className="h-6 w-6 text-accent-warning" />
                        </div>
                        <h3 className="text-h3 font-semibold text-light-text-primary dark:text-dark-text-primary">
                            Growth recommendations
                        </h3>
                        <p className="text-body text-light-text-secondary dark:text-dark-text-secondary">
                            Actionable steps to improve your developer profile
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
