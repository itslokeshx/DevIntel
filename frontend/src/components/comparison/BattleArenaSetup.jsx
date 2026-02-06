import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Swords, Loader2 } from 'lucide-react';

export function BattleArenaSetup({ onBattleStart, loading: externalLoading }) {
    const [fighterA, setFighterA] = useState('');
    const [fighterB, setFighterB] = useState('');
    const [error, setError] = useState('');
    const [localLoading, setLocalLoading] = useState(false);

    // Derived loading state
    const loading = externalLoading || localLoading;

    const recentSearches = ['torvalds', 'gvanrossum', 'dhh', 'tj'];

    const handleStartBattle = () => {
        if (!fighterA.trim() || !fighterB.trim()) {
            setError('Both usernames are required');
            return;
        }

        if (fighterA.trim().toLowerCase() === fighterB.trim().toLowerCase()) {
            setError('Please select two different users');
            return;
        }

        setError('');
        setLocalLoading(true); // Show loading immediately
        onBattleStart(fighterA.trim(), fighterB.trim());
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl w-full"
            >
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Compare Developers</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Analyze coding styles, tech stacks, and activity patterns.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-8 md:p-12 relative">
                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                            {/* Fighter A */}
                            <div className="flex-1 w-full relative z-10">
                                <FighterInput
                                    value={fighterA}
                                    onChange={setFighterA}
                                    placeholder="First Username"
                                    color="blue"
                                    disabled={loading}
                                />
                            </div>

                            {/* Center Action */}
                            <div className="flex flex-col items-center justify-center relative z-10">
                                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 font-bold mb-4 md:mb-0 transform md:rotate-0 rotate-90">
                                    VS
                                </div>
                            </div>

                            {/* Fighter B */}
                            <div className="flex-1 w-full relative z-10">
                                <FighterInput
                                    value={fighterB}
                                    onChange={setFighterB}
                                    placeholder="Second Username"
                                    color="purple"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Recent Matches */}
                        <div className="mt-12 text-center">
                            <p className="text-sm text-gray-500 mb-3">Popular Comparisons</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {recentSearches.map((user) => (
                                    <button
                                        key={user}
                                        onClick={() => !fighterA ? setFighterA(user) : setFighterB(user)}
                                        className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
                                    >
                                        {user}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 border-t border-gray-200 dark:border-gray-700 flex flex-col items-center">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-4 text-red-500 text-sm font-medium"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={handleStartBattle}
                            disabled={loading || !fighterA || !fighterB}
                            className="w-full md:w-auto min-w-[200px] px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <Swords className="w-5 h-5" />
                                    <span>Compare Now</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function FighterInput({ value, onChange, placeholder, color, disabled }) {
    return (
        <div className="space-y-4">
            <div className={`aspect-square w-24 mx-auto rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 ${value ? 'border-gray-200 dark:border-gray-600' : 'border-transparent'} relative transition-all`}>
                {value ? (
                    <img
                        src={`https://github.com/${value}.png`}
                        alt={value}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                ) : null}
                <div className={`${value ? 'hidden' : 'flex'} items-center justify-center w-full h-full text-gray-400`}>
                    <User className="w-8 h-8" />
                </div>
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                placeholder={placeholder}
                className="w-full text-center bg-transparent text-xl font-bold text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none border-b-2 border-transparent focus:border-gray-900 dark:focus:border-white transition-colors pb-2"
            />
        </div>
    );
}
