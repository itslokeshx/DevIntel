import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Crown, Sparkles } from 'lucide-react';

export function WinnerAnnouncement({ winner, winnerName, margin, description, onComplete }) {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (winner !== 'TIE') {
            const timer = setTimeout(() => {
                setShowConfetti(true);
                fireConfetti();
            }, 500);

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
            <div className="text-center py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4"
                >
                    <span className="text-3xl">🤝</span>
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Evenly Matched</h2>
                <p className="text-gray-600 dark:text-gray-400">Both developers bring unique strengths.</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto shadow-sm"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center justify-center p-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full mb-6"
            >
                <Trophy className="w-8 h-8" />
            </motion.div>

            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {winnerName} Wins!
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
                {description}
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Victory Margin: {margin} points</span>
            </div>
        </motion.div>
    );
}
