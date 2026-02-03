import React from 'react';
import { Card } from '../common/Card';
import { Target, TrendingUp, Zap, Lightbulb } from 'lucide-react';

export function DeveloperOverview({ data }) {
    const { profile, metrics, aiInsights } = data;

    return (
        <div className="space-y-6">
            {/* Profile Section */}
            <Card padding="lg">
                <div className="flex items-start space-x-6">
                    {/* Avatar */}
                    <img
                        src={profile.avatarUrl}
                        alt={profile.name || data.username}
                        className="w-24 h-24 rounded-full border-2 border-light-border dark:border-dark-border"
                    />

                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="text-h1 font-bold text-light-text-primary dark:text-dark-text-primary">
                            {profile.name || data.username}
                        </h1>

                        {profile.bio && (
                            <p className="text-body text-light-text-secondary dark:text-dark-text-secondary mt-2">
                                {profile.bio}
                            </p>
                        )}

                        <div className="flex items-center space-x-4 mt-3 text-small text-light-text-secondary dark:text-dark-text-secondary">
                            {profile.location && <span>📍 {profile.location}</span>}
                            {profile.company && <span>🏢 {profile.company}</span>}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card padding="md">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-full bg-accent-primary/10 dark:bg-accent-primary-dark/10">
                            <Target className="h-6 w-6 text-accent-primary dark:text-accent-primary-dark" />
                        </div>
                        <div>
                            <p className="text-small text-light-text-secondary dark:text-dark-text-secondary">
                                Dev Score
                            </p>
                            <p className="text-h2 font-bold text-light-text-primary dark:text-dark-text-primary">
                                {metrics.devScore}/100
                            </p>
                        </div>
                    </div>
                </Card>

                <Card padding="md">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-full bg-accent-secondary/10 dark:bg-accent-secondary-dark/10">
                            <TrendingUp className="h-6 w-6 text-accent-secondary dark:text-accent-secondary-dark" />
                        </div>
                        <div>
                            <p className="text-small text-light-text-secondary dark:text-dark-text-secondary">
                                Consistency
                            </p>
                            <p className="text-h2 font-bold text-light-text-primary dark:text-dark-text-primary">
                                {metrics.consistencyScore}/100
                            </p>
                        </div>
                    </div>
                </Card>

                <Card padding="md">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-full bg-accent-warning/10">
                            <Zap className="h-6 w-6 text-accent-warning" />
                        </div>
                        <div>
                            <p className="text-small text-light-text-secondary dark:text-dark-text-secondary">
                                Impact
                            </p>
                            <p className="text-h2 font-bold text-light-text-primary dark:text-dark-text-primary">
                                {metrics.impactScore}/100
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* AI One-Liner */}
            {aiInsights?.oneLineInsight && (
                <Card padding="md" variant="highlight">
                    <div className="flex items-start space-x-3">
                        <Lightbulb className="h-5 w-5 text-accent-primary dark:text-accent-primary-dark mt-0.5 flex-shrink-0" />
                        <p className="text-body text-light-text-primary dark:text-dark-text-primary">
                            {aiInsights.oneLineInsight}
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
}
