import React from 'react';
import { Github, Sparkles } from 'lucide-react';

/**
 * Clean, premium empty state for users with no public activity
 */
export function EmptyProfile({ username }) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-6">
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Github className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    No Public Activity
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                    <span className="font-medium">{username}</span> hasn't created any public repositories or made any public contributions yet.
                </p>

                {/* Suggestion */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Try searching for a developer with public repos</span>
                </div>

                {/* Examples */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                        Try these developers:
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {['torvalds', 'gaearon', 'tj', 'sindresorhus'].map(name => (
                            <a
                                key={name}
                                href={`/github/${name}`}
                                className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                            >
                                {name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
