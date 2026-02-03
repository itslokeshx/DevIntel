import React, { useState } from 'react';
import { Search, Users, Sparkles } from 'lucide-react';
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
        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm border border-light-border dark:border-dark-border p-8 mb-8 relative overflow-hidden">


            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg text-white">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                            Developer Comparison
                        </h2>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary">
                            Analyze and compare two profiles side-by-side with AI insights
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 w-full group">
                        <label className="block text-xs font-bold text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wider mb-2 group-focus-within:text-indigo-500 transition-colors">
                            Developer A
                        </label>
                        <Input
                            placeholder="e.g. facebook"
                            value={userA}
                            onChange={(e) => setUserA(e.target.value)}
                            className="bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800 focus:ring-indigo-500 w-full h-12 text-lg"
                        />
                    </div>

                    <div className="hidden md:flex flex-col items-center justify-end h-full pb-2 px-2 pt-6">
                        <span className="w-8 h-8 rounded-full bg-light-bg-tertiary dark:bg-dark-bg-tertiary border border-light-border dark:border-dark-border flex items-center justify-center text-xs font-black text-light-text-tertiary dark:text-dark-text-tertiary">
                            VS
                        </span>
                    </div>

                    <div className="flex-1 w-full group">
                        <label className="block text-xs font-bold text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wider mb-2 group-focus-within:text-violet-500 transition-colors">
                            Developer B
                        </label>
                        <Input
                            placeholder="e.g. google"
                            value={userB}
                            onChange={(e) => setUserB(e.target.value)}
                            className="bg-violet-50/50 dark:bg-violet-900/10 border-violet-200 dark:border-violet-800 focus:ring-violet-500 w-full h-12 text-lg"
                        />
                    </div>

                    <div className="w-full md:w-auto pt-6">
                        <Button
                            type="submit"
                            disabled={loading || !userA || !userB}
                            className={`w-full md:min-w-[140px] h-12 text-lg shadow-lg shadow-primary-500/20 ${loading ? 'opacity-80' : ''}`}
                        >
                            {loading ? 'Analyzing...' : 'Compare Now'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
