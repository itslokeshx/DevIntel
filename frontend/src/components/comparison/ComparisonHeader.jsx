import React, { useState } from 'react';
import { Search, Users } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export function ComparisonHeader({ onCompare, loading }) {
    const [userA, setUserA] = useState('');
    const [userB, setUserB] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userA && userB) {
            onCompare(userA, userB);
        }
    };

    return (
        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm border border-light-border dark:border-dark-border p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
                        Developer Comparison
                    </h2>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        Compare skills, consistency, and impact side-by-side
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                        Developer A
                    </label>
                    <Input
                        placeholder="GitHub Username"
                        value={userA}
                        onChange={(e) => setUserA(e.target.value)}
                        className="bg-primary-50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800 focus:ring-primary-500"
                    />
                </div>

                <div className="flex items-center justify-center pb-3">
                    <span className="text-sm font-bold text-light-text-tertiary dark:text-dark-text-tertiary bg-light-bg-tertiary dark:bg-dark-bg-tertiary px-2 py-1 rounded">
                        VS
                    </span>
                </div>

                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                        Developer B
                    </label>
                    <Input
                        placeholder="GitHub Username"
                        value={userB}
                        onChange={(e) => setUserB(e.target.value)}
                        className="bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800 focus:ring-purple-500"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={loading || !userA || !userB}
                    className="w-full md:w-auto min-w-[120px]"
                >
                    {loading ? 'Analyzing...' : 'Compare'}
                </Button>
            </form>
        </div>
    );
}
