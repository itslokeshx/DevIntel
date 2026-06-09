import React from 'react';

export function RecentSubmissions({ submissions }) {
    if (!submissions || submissions.length === 0) return null;

    return (
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 sm:p-7">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-5">
                Recent Activity
            </h3>

            <div className="space-y-1">
                {submissions.map((sub, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-[var(--surface-hover)] transition-colors"
                    >
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="min-w-0">
                                <a
                                    href={`https://leetcode.com/problems/${sub.titleSlug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[13px] font-medium text-[var(--text-primary)] hover:underline hover:text-[var(--accent)] transition-colors block truncate"
                                >
                                    {sub.title}
                                </a>
                                <div className="flex items-center gap-2 text-[11px] text-[var(--text-tertiary)]">
                                    <span>{new Date(sub.timestamp * 1000).toLocaleDateString()}</span>
                                    <span>·</span>
                                    <span className="capitalize">{sub.lang}</span>
                                </div>
                            </div>
                        </div>

                        <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sub.status === 'Accepted'
                                ? 'text-green-600 dark:text-green-400 bg-green-500/10'
                                : 'text-red-600 dark:text-red-400 bg-red-500/10'
                            }`}>
                            {sub.status}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
