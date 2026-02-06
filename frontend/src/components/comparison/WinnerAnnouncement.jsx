import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Crown, Sparkles } from 'lucide-react';

export function WinnerAnnouncement({ winner, winnerName, margin, description, onComplete }) {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (winner !== 'TIE') {
            // Trigger confetti after a short delay
            const timer = setTimeout(() => {
                setShowConfetti(true);
                fireConfetti();
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [winner]);

    const fireConfetti = () => {
        const duration = 3000;
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

            // Confetti from left
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#FFD700', '#FFA500', '#FF6347', '#4169E1', '#9370DB']
            });

            // Confetti from right
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#FFD700', '#FFA500', '#FF6347', '#4169E1', '#9370DB']
            });
        }, 250);
    };

    if (winner === 'TIE') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: 'spring', bounce: 0.5 }}
                className="text-center py-16"
            >
                <motion.div
                    animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="text-9xl mb-6"
                >
                    🤝
                </motion.div>
                <h2 className="text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                    EVENLY MATCHED
                </h2>
                <p className="text-2xl text-gray-400">
                    Both developers bring unique strengths to the table
                </p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full"
                >
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <span className="text-lg font-semibold text-gray-300">
                        Score Difference: {margin} points
                    </span>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', bounce: 0.5 }}
            className="text-center py-16 relative"
        >
            {/* Animated crown */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="text-9xl mb-6"
            >
                👑
            </motion.div>

            {/* Winner badge */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring', bounce: 0.6 }}
                className="inline-block mb-6"
            >
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-3 rounded-full font-black text-2xl flex items-center gap-3 shadow-2xl">
                    <Trophy className="w-8 h-8" />
                    WINNER
                    <Trophy className="w-8 h-8" />
                </div>
            </motion.div>

            {/* Winner name */}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-7xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"
            >
                {winnerName}
            </motion.h2>

            {/* Victory description */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-3xl font-bold text-gray-300 mb-8"
            >
                {description}
            </motion.p>

            {/* Score margin */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full"
            >
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <span className="text-xl font-semibold text-gray-300">
                    Victory Margin: {margin} points
                </span>
                <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>

            {/* Floating particles */}
            {showConfetti && (
                <>
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                opacity: 0,
                                x: Math.random() * 200 - 100,
                                y: 0,
                            }}
                            animate={{
                                opacity: [0, 1, 0],
                                y: -200,
                                x: Math.random() * 400 - 200,
                            }}
                            transition={{
                                duration: 2 + Math.random() * 2,
                                delay: Math.random() * 2,
                                repeat: Infinity,
                            }}
                            className="absolute text-4xl"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: '50%',
                            }}
                        >
                            {['🎉', '✨', '🏆', '⭐', '💫'][Math.floor(Math.random() * 5)]}
                        </motion.div>
                    ))}
                </>
            )}
        </motion.div>
    );
}
