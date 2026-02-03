import React from 'react';
import { Card } from '../common/Card';
import { Star, GitFork, ExternalLink } from 'lucide-react';

export function RepoCard({ repo }) {
    const getHealthColor = (score) => {
        if (score >= 80) return 'bg-accent-secondary dark:bg-accent-secondary-dark';
        if (score >= 60) return 'bg-accent-primary dark:bg-accent-primary-dark';
        if (score >= 40) return 'bg-accent-warning';
        return 'bg-accent-error';
    };

    const getMaturityBadge = (stage) => {
        const colors = {
            idea: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
            active: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
            stable: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
            abandoned: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
        };

        return colors[stage] || colors.active;
    };

    return (
        <Card padding="md" className="hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-h3 font-semibold text-accent-primary dark:text-accent-primary-dark hover:underline inline-flex items-center"
                    >
                        {repo.name}
                        <ExternalLink className="ml-1 h-4 w-4" />
                    </a>

                    <div className="flex items-center space-x-3 mt-2">
                        {repo.language && (
                            <span className="text-small text-light-text-secondary dark:text-dark-text-secondary">
                                {repo.language}
                            </span>
                        )}
                        <span className="flex items-center text-small text-light-text-secondary dark:text-dark-text-secondary">
                            <Star className="h-4 w-4 mr-1" />
                            {repo.stars}
                        </span>
                        <span className="flex items-center text-small text-light-text-secondary dark:text-dark-text-secondary">
                            <GitFork className="h-4 w-4 mr-1" />
                            {repo.forks}
                        </span>
                    </div>
                </div>
            </div>

            {/* AI Summary */}
            {repo.aiSummary && (
                <p className="text-body text-light-text-secondary dark:text-dark-text-secondary mb-3">
                    {repo.aiSummary}
                </p>
            )}

            {/* Health Bar */}
            <div className="mb-3">
                <div className="flex items-center justify-between text-small mb-1">
                    <span className="text-light-text-secondary dark:text-dark-text-secondary">Health</span>
                    <span className="font-medium text-light-text-primary dark:text-dark-text-primary">
                        {repo.healthScore}/100
                    </span>
                </div>
                <div className="w-full h-2 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-full overflow-hidden">
                    <div
                        className={`h-full ${getHealthColor(repo.healthScore)} transition-all`}
                        style={{ width: `${repo.healthScore}%` }}
                    />
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 rounded text-tiny font-medium ${getMaturityBadge(repo.maturityStage)}`}>
                    {repo.maturityStage}
                </span>

                {repo.documentationQuality !== 'none' && (
                    <span className="px-2 py-1 rounded text-tiny font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {repo.documentationQuality} docs
                    </span>
                )}
            </div>
        </Card>
    );
}
