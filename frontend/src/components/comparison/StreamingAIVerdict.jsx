import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function StreamingAIVerdict({ text, onComplete }) {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!text) return;

        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, 15);

            return () => clearTimeout(timeout);
        } else {
            onComplete?.();
        }
    }, [currentIndex, text, onComplete]);

    return (
        <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                </div>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">AI Analysis</h3>
                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                    {displayedText}
                    {currentIndex < text.length && (
                        <span className="inline-block w-1.5 h-4 bg-blue-500 ml-1 align-middle animate-pulse" />
                    )}
                </div>
            </div>
        </div>
    );
}
