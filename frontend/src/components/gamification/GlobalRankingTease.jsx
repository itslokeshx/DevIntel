import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Trophy } from 'lucide-react';

export function GlobalRankingTease({ rank, totalUsers = 50000 }) {
    // Calculate percentile
    const percentile = Math.round((1 - rank / totalUsers) * 100);

    // Determine rank tier
    let tier = 'Developer';
    let tierColor = 'text-gray-400';
    let tierGradient = 'from-gray-600 to-gray-800';

    if (percentile >= 99) {
        tier = 'Elite';
        tierColor = 'text-purple-400';
        tierGradient = 'from-purple-600 to-pink-600';
    } else if (percentile >= 95) {
        tier = 'Expert';
        tierColor = 'text-yellow-400';
        tierGradient = 'from-yellow-500 to-orange-500';
    } else if (percentile >= 80) {
        tier = 'Advanced';
        tierColor = 'text-blue-400';
        tierGradient = 'from-blue-500 to-cyan-500';
    } else if (percentile >= 50) {
        tier = 'Intermediate';
        tierColor = 'text-green-400';
        tierGradient = 'from-green-500 to-teal-500';
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-r ${tierGradient} bg-opacity-10 border border-opacity-30 rounded-xl p-6 relative overflow-hidden`}
            style={{
                borderColor: tierColor.replace('text-', '')
            }}
        >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <motion.div
                    animate={{
                        backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: 'reverse',
                    }}
                    className="w-full h-full"
                    style={{
                        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                        backgroundSize: '30px 30px',
                    }}
                />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Trophy className={`w-5 h-5 ${tierColor}`} />
                            <span className={`text-sm font-semibold ${tierColor}`}>
                                {tier} Tier
                            </span>
                        </div>
                        <div className="text-sm text-gray-400 mb-1">Global Ranking</div>
                        <div className="flex items-baseline gap-2">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', bounce: 0.5 }}
                                className="text-5xl font-black text-white"
                            >
                                #{rank.toLocaleString()}
                            </motion.div>
                            <div className="text-gray-400 text-sm">
                                / {totalUsers.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Percentile badge */}
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: 'spring', bounce: 0.6 }}
                        className={`bg-gradient-to-br ${tierGradient} px-4 py-2 rounded-full`}
                    >
                        <div className="text-white font-bold text-lg">
                            Top {percentile}%
                        </div>
                    </motion.div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-gray-400">Rank Change</span>
                        </div>
                        <div className="text-lg font-bold text-green-400">
                            +127
                        </div>
                        <div className="text-xs text-gray-500">This month</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Users className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-gray-400">Ahead of</span>
                        </div>
                        <div className="text-lg font-bold text-blue-400">
                            {(totalUsers - rank).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Developers</div>
                    </div>
                </div>

                {/* CTA Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full px-4 py-3 bg-gradient-to-r ${tierGradient} rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 group`}
                >
                    <span>View Full Leaderboard</span>
                    <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        →
                    </motion.span>
                </motion.button>

                {/* Coming soon badge */}
                <div className="mt-3 text-center">
                    <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
                        🚀 Coming Soon
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
