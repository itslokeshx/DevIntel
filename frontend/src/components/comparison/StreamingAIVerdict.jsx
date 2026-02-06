import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';

export function StreamingAIVerdict({ text, onComplete }) {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!text) return;

        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, 20); // 20ms per character for smooth streaming

            return () => clearTimeout(timeout);
        } else if (!isComplete) {
            setIsComplete(true);
            onComplete?.();
        }
    }, [currentIndex, text, isComplete, onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-8 relative overflow-hidden"
        >
            {/* Animated background */}
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
                        backgroundImage: 'radial-gradient(circle, #fbbf24 1px, transparent 1px)',
                        backgroundSize: '50px 50px',
                    }}
                />
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <motion.div
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
                <h2 className="text-2xl font-bold text-yellow-400">🧬 AI REFEREE VERDICT</h2>
                <motion.div
                    animate={{
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                    }}
                >
                    <Zap className="w-5 h-5 text-orange-400" />
                </motion.div>
            </div>

            {/* Streaming text */}
            <div className="prose prose-invert max-w-none relative z-10">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {displayedText}
                    {!isComplete && (
                        <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="inline-block w-2 h-5 bg-yellow-400 ml-1"
                        />
                    )}
                </p>
            </div>

            {/* Completion indicator */}
            {isComplete && (
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}
                    className="mt-4 flex justify-end"
                >
                    <span className="text-xs text-yellow-400/70">✓ Analysis Complete</span>
                </motion.div>
            )}
        </motion.div>
    );
}
