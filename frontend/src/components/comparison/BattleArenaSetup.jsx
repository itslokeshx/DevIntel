import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Swords, Loader2, Sparkles, TrendingUp, GitCompare } from 'lucide-react';

export function BattleArenaSetup({ onBattleStart, loading: externalLoading }) {
    const [fighterA, setFighterA] = useState('');
    const [fighterB, setFighterB] = useState('');
    const [error, setError] = useState('');
    const [localLoading, setLocalLoading] = useState(false);

    const loading = externalLoading || localLoading;

    const recentSearches = [
        { username: 'torvalds', label: 'Linus Torvalds' },
        { username: 'gvanrossum', label: 'Guido van Rossum' },
        { username: 'dhh', label: 'DHH' },
        { username: 'tj', label: 'TJ Holowaychuk' }
    ];

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
        setLocalLoading(true);
        onBattleStart(fighterA.trim(), fighterB.trim());
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && fighterA && fighterB && !loading) {
            handleStartBattle();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl w-full relative z-10"
            >
                {/* Header Section */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.5 }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg"
                    >
                        <GitCompare className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Developer Showdown
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                        Compare coding styles, tech stacks, and contribution patterns. Discover who leads in the metrics that matter.
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-10 md:p-14">
                        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                            {/* Fighter A */}
                            <div className="flex-1 w-full">
                                <FighterInput
                                    value={fighterA}
                                    onChange={setFighterA}
                                    onKeyPress={handleKeyPress}
                                    placeholder="First Developer"
                                    color="blue"
                                    disabled={loading}
                                />
                            </div>

                            {/* Center Divider */}
                            <div className="flex flex-col items-center justify-center">
                                <motion.div
                                    animate={{
                                        rotate: [0, 5, -5, 0],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'easeInOut'
                                    }}
                                    className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg transform md:rotate-0 rotate-90"
                                >
                                    VS
                                </motion.div>
                            </div>

                            {/* Fighter B */}
                            <div className="flex-1 w-full">
                                <FighterInput
                                    value={fighterB}
                                    onChange={setFighterB}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Second Developer"
                                    color="purple"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Popular Comparisons */}
                        <div className="mt-12 text-center">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Popular Comparisons
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                {recentSearches.map((item) => (
                                    <button
                                        key={item.username}
                                        onClick={() => !fighterA ? setFighterA(item.username) : setFighterB(item.username)}
                                        disabled={loading}
                                        className="group px-4 py-2 text-sm font-medium bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-all border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="flex items-center gap-2">
                                            <img
                                                src={`https://github.com/${item.username}.png`}
                                                alt={item.username}
                                                className="w-5 h-5 rounded-full"
                                            />
                                            {item.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 px-10 py-6 border-t border-gray-200 dark:border-gray-700 flex flex-col items-center gap-4">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={handleStartBattle}
                            disabled={loading || !fighterA || !fighterB}
                            className="w-full md:w-auto min-w-[280px] px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Analyzing Profiles...</span>
                                </>
                            ) : (
                                <>
                                    <TrendingUp className="w-5 h-5" />
                                    <span>Compare Developers</span>
                                </>
                            )}
                        </button>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Press Enter to compare • Data sourced from GitHub API
                        </p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon="📊"
                        title="Detailed Metrics"
                        description="Compare commits, stars, repos, and more"
                    />
                    <FeatureCard
                        icon="🤖"
                        title="AI Analysis"
                        description="Get intelligent insights on coding patterns"
                    />
                    <FeatureCard
                        icon="⚡"
                        title="Real-time Data"
                        description="Fresh data pulled directly from GitHub"
                    />
                </div>
            </motion.div>
        </div>
    );
}

function FighterInput({ value, onChange, onKeyPress, placeholder, color, disabled }) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="space-y-4">
            <motion.div
                animate={{ scale: value ? 1 : 0.95 }}
                className={`aspect-square w-28 mx-auto rounded-2xl overflow-hidden bg-gradient-to-br ${color === 'blue'
                        ? 'from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20'
                        : 'from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20'
                    } border-2 ${value
                        ? color === 'blue'
                            ? 'border-blue-300 dark:border-blue-700'
                            : 'border-purple-300 dark:border-purple-700'
                        : 'border-transparent'
                    } relative transition-all shadow-lg`}
            >
                {value ? (
                    <img
                        src={`https://github.com/${value}.png`}
                        alt={value}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div className={`${value ? 'hidden' : 'flex'} items-center justify-center w-full h-full ${color === 'blue' ? 'text-blue-400' : 'text-purple-400'
                    }`}>
                    <User className="w-10 h-10" />
                </div>
            </motion.div>

            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyPress={onKeyPress}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={`w-full text-center bg-transparent text-xl font-bold text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none border-b-2 transition-colors pb-3 ${isFocused
                            ? color === 'blue'
                                ? 'border-blue-500'
                                : 'border-purple-500'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                />
                {value && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -bottom-6 left-0 right-0 text-center"
                    >
                        <span className="text-xs text-gray-500 dark:text-gray-400">@{value}</span>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700"
        >
            <div className="text-4xl mb-3">{icon}</div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </motion.div>
    );
}
