import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { Card } from '../common/Card';

export function RecentSubmissions({ submissions }) {
    if (!submissions || submissions.length === 0) return null;

    return (
        <Card>
            <h3 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                Recent Activity
            </h3>

            <div className="space-y-3">
                {submissions.map((sub, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-light-bg-tertiary dark:bg-dark-bg-tertiary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className={`p-1.5 rounded-full ${sub.status === 'Accepted'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                }`}>
                                <CheckCircle className="w-4 h-4" />
                            </span>
                            <div>
                                <a
                                    href={`https://leetcode.com/problems/${sub.titleSlug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-light-text-primary dark:text-dark-text-primary hover:text-primary-600 dark:hover:text-primary-400 transition-colors block"
                                >
                                    {sub.title}
                                </a>
                                <div className="flex items-center gap-2 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                    <span>{new Date(sub.timestamp).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span className="capitalize">{sub.lang}</span>
                                </div>
                            </div>
                        </div>

                        <div className={`px-2 py-1 rounded text-xs font-bold ${sub.status === 'Accepted'
                                ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10'
                                : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10'
                            }`}>
                            {sub.status}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
