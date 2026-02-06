import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, Crown, Award } from 'lucide-react';

export function AchievementBadges({ achievements }) {
    if (!achievements || achievements.length === 0) {
        return null;
    }

    const tierColors = {
        legendary: 'from-purple-500 via-pink-500 to-red-500',
        gold: 'from-yellow-400 to-orange-500',
        silver: 'from-gray-300 to-gray-500',
        bronze: 'from-orange-400 to-amber-600'
    };

    const tierBorders = {
        legendary: 'border-purple-500',
        gold: 'border-yellow-400',
        silver: 'border-gray-400',
        bronze: 'border-orange-500'
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">
                    Achievements Unlocked ({achievements.length})
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {achievements.map((achievement, index) => (
                    <motion.div
                        key={achievement.id}
                        initial={{ scale: 0, rotate: -180, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{
                            delay: index * 0.1,
                            type: 'spring',
                            bounce: 0.5
                        }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className={`bg-gradient-to-br ${tierColors[achievement.tier]} p-[2px] rounded-xl`}
                    >
                        <div className="bg-gray-900 rounded-xl p-4 h-full">
                            <div className="flex items-start gap-3">
                                <motion.div
                                    animate={{
                                        rotate: [0, 10, -10, 0],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatDelay: 3
                                    }}
                                    className="text-4xl"
                                >
                                    {achievement.icon}
                                </motion.div>
                                <div className="flex-1">
                                    <div className="font-bold text-white text-sm mb-1">
                                        {achievement.name}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {achievement.description}
                                    </div>
                                    <div className={`text-xs font-semibold mt-2 ${achievement.tier === 'legendary' ? 'text-purple-400' :
                                            achievement.tier === 'gold' ? 'text-yellow-400' :
                                                achievement.tier === 'silver' ? 'text-gray-400' :
                                                    'text-orange-400'
                                        }`}>
                                        {achievement.tier.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Achievement Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: achievements.length * 0.1 + 0.3 }}
                className="bg-gray-800/50 rounded-xl p-4 mt-4"
            >
                <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-purple-400">
                            {achievements.filter(a => a.tier === 'legendary').length}
                        </div>
                        <div className="text-xs text-gray-400">Legendary</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-yellow-400">
                            {achievements.filter(a => a.tier === 'gold').length}
                        </div>
                        <div className="text-xs text-gray-400">Gold</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-400">
                            {achievements.filter(a => a.tier === 'silver').length}
                        </div>
                        <div className="text-xs text-gray-400">Silver</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-orange-400">
                            {achievements.filter(a => a.tier === 'bronze').length}
                        </div>
                        <div className="text-xs text-gray-400">Bronze</div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// Compact badge display for comparison view
export function CompactAchievementBadges({ achievements, maxDisplay = 5 }) {
    if (!achievements || achievements.length === 0) {
        return null;
    }

    const displayAchievements = achievements.slice(0, maxDisplay);
    const remaining = achievements.length - maxDisplay;

    return (
        <div className="flex flex-wrap gap-2">
            {displayAchievements.map((achievement, index) => (
                <motion.div
                    key={achievement.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.2 }}
                    className="relative group"
                    title={`${achievement.name}: ${achievement.description}`}
                >
                    <div className="text-2xl cursor-pointer">
                        {achievement.icon}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {achievement.name}
                    </div>
                </motion.div>
            ))}
            {remaining > 0 && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full text-xs font-bold text-white"
                >
                    +{remaining}
                </motion.div>
            )}
        </div>
    );
}
