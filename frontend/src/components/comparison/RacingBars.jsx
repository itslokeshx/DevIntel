import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Trophy, Flame } from 'lucide-react';

export function RacingBars({ label, valueA, valueB, userA, userB, icon: Icon }) {
    const maxValue = Math.max(valueA, valueB, 1);
    const percentageA = (valueA / maxValue) * 100;
    const percentageB = (valueB / maxValue) * 100;

    const winner = valueA > valueB ? 'A' : valueB > valueA ? 'B' : 'tie';
    const isDominatingWin = (valueA / Math.max(valueB, 1)) >= 2 || (valueB / Math.max(valueA, 1)) >= 2;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{label}</span>
                </div>
                {winner !== 'tie' && (
                    <div className="flex items-center gap-2">
                        {isDominatingWin && <Flame className="w-5 h-5 text-orange-500 animate-pulse" />}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {winner === 'A' ? userA : userB} {isDominatingWin ? 'DOMINATES' : 'leads'}
                        </span>
                    </div>
                )}
            </div>

            {/* Racing bars from center */}
            <div className="relative">
                {/* Fighter A - Left side */}
                <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{userA}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                <CountUp end={valueA} duration={1.5} separator="," />
                            </span>
                            {winner === 'A' && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1.5, type: 'spring', bounce: 0.5 }}
                                >
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                </motion.div>
                            )}
                        </div>
                    </div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentageA}%` }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            className={`h-full rounded-full ${winner === 'A'
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50'
                                    : 'bg-gray-400 dark:bg-gray-600'
                                }`}
                        >
                            {winner === 'A' && (
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Fighter B - Right side */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{userB}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                <CountUp end={valueB} duration={1.5} separator="," />
                            </span>
                            {winner === 'B' && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1.5, type: 'spring', bounce: 0.5 }}
                                >
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                </motion.div>
                            )}
                        </div>
                    </div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentageB}%` }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            className={`h-full rounded-full ${winner === 'B'
                                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg shadow-purple-500/50'
                                    : 'bg-gray-400 dark:bg-gray-600'
                                }`}
                        >
                            {winner === 'B' && (
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Dominating win badge */}
                {isDominatingWin && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 2, type: 'spring', bounce: 0.6 }}
                        className="absolute -right-4 top-1/2 -translate-y-1/2"
                    >
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                            <Flame className="w-3 h-3" />
                            2X
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Tie indicator */}
            {winner === 'tie' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-full text-sm font-semibold">
                        🤝 Perfectly Matched
                    </span>
                </motion.div>
            )}
        </div>
    );
}
