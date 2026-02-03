import React from 'react';

export function TechStackOverlap({ techStack }) {
    if (!techStack) return null;

    const { shared, uniqueA, uniqueB, overlapPercentage } = techStack;

    return (
        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm border border-light-border dark:border-dark-border p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary">
                    Tech Stack DNA
                </h3>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-bold rounded-full">
                    {overlapPercentage}% Overlap
                </span>
            </div>

            <div className="space-y-6">
                {/* Shared Skills */}
                <div>
                    <h4 className="text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Shared Technologies
                    </h4>
                    {shared.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {shared.map(tech => (
                                <span key={tech} className="px-3 py-1 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded text-sm font-medium">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary italic">
                            No shared technologies found
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* User A Unique */}
                    <div>
                        <h4 className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-3 border-b-2 border-primary-100 dark:border-primary-800 pb-1">
                            Unique to User A
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {uniqueA.map(tech => (
                                <span key={tech} className="px-2 py-1 bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-300 rounded text-xs font-medium">
                                    {tech}
                                </span>
                            ))}
                            {uniqueA.length === 0 && (
                                <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary italic">None</span>
                            )}
                        </div>
                    </div>

                    {/* User B Unique */}
                    <div>
                        <h4 className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-3 border-b-2 border-purple-100 dark:border-purple-800 pb-1">
                            Unique to User B
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {uniqueB.map(tech => (
                                <span key={tech} className="px-2 py-1 bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300 rounded text-xs font-medium">
                                    {tech}
                                </span>
                            ))}
                            {uniqueB.length === 0 && (
                                <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary italic">None</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
