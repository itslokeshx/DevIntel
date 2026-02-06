import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles } from 'lucide-react';

export function WinnerAnnouncement({ winner, winnerName, margin, description, onComplete }) {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (winner !== 'TIE') {
            const timer = setTimeout(() => {
                setShowConfetti(true);
                fireConfetti();
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [winner]);

    const fireConfetti = () => {
        const duration = 2000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
                onComplete?.();
                return;
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']
            });
        }, 250);
    };

    if (winner === 'TIE') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center shadow-lg"
            >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
                    <span className="text-4xl">🤝</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">Evenly Matched</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    Both developers bring unique strengths to the table.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Score Difference: {margin} points</span>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden"
        >
            <div className="bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-yellow-900/10 dark:via-gray-800 dark:to-orange-900/10 rounded-2xl border-2 border-yellow-200 dark:border-yellow-800/30 p-12 text-center shadow-xl">
                {/* Trophy Icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', bounce: 0.6, delay: 0.2 }}
                    className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 shadow-lg"
                >
                    <Trophy className="w-12 h-12 text-white" />
                </motion.div>

                {/* Winner Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="inline-block mb-4"
                >
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider">
                        🏆 Winner
                    </div>
                </motion.div>

                {/* Winner Name */}
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4"
                >
                    {winnerName}
                </motion.h2>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
                >
                    {description}
                </motion.p>

                {/* Victory Margin */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700"
                >
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Victory Margin: <span className="text-yellow-600 dark:text-yellow-400">{margin} points</span>
                    </span>
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute top-4 left-4 text-4xl opacity-20">✨</div>
                <div className="absolute top-4 right-4 text-4xl opacity-20">⭐</div>
                <div className="absolute bottom-4 left-8 text-3xl opacity-20">🎉</div>
                <div className="absolute bottom-4 right-8 text-3xl opacity-20">🎊</div>
            </div>
        </motion.div>
    );
}
