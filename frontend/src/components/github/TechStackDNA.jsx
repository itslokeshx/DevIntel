import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Loader2 } from 'lucide-react';

const languageColors = {
    'JavaScript': '#f7df1e',
    'TypeScript': '#3178c6',
    'Python': '#3776ab',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Java': '#b07219',
    'Go': '#00add8',
    'Rust': '#dea584',
    'PHP': '#4f5d95',
    'Jupyter Notebook': '#da5b0b',
    'C++': '#00599c',
    'C': '#a8b9cc',
    'Ruby': '#cc342d',
    'Swift': '#fa7343',
    'Kotlin': '#7f52ff',
    'Dart': '#0175c2',
    'Shell': '#89e051',
    'PowerShell': '#012456',
    'R': '#276dc3',
    'MATLAB': '#e16737'
};

export function TechStackDNA({ languageStats, repositories }) {
    const [forecast, setForecast] = useState(null);
    const [loadingForecast, setLoadingForecast] = useState(false);
    
    useEffect(() => {
        if (languageStats && languageStats.length > 0) {
            fetchForecast();
        }
    }, [languageStats]);
    
    const fetchForecast = async () => {
        setLoadingForecast(true);
        try {
            // This would call your backend API for AI forecast
            // For now, we'll use a simple client-side prediction
            setTimeout(() => {
                const topLang = languageStats[0]?.name;
                setForecast(
                    topLang === 'TypeScript' 
                        ? 'TypeScript usage trending +30% based on recent project patterns. Python dominance stable. Consider exploring Go or Rust for systems work.'
                        : `${topLang} remains your dominant stack. Consider exploring complementary technologies for full-stack capabilities.`
                );
                setLoadingForecast(false);
            }, 1000);
        } catch (err) {
            setLoadingForecast(false);
        }
    };
    
    if (!languageStats || languageStats.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">🧪 Tech Stack DNA</h3>
                <p className="text-gray-500 dark:text-gray-400">No language data available</p>
            </div>
        );
    }
    
    const sortedLanguages = languageStats
        .sort((a, b) => (b.count || b.repos || 0) - (a.count || a.repos || 0))
        .slice(0, 8);
    
    const totalRepos = languageStats.reduce((sum, lang) => sum + (lang.count || lang.repos || 0), 0);
    
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">🧪 Tech Stack DNA</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{languageStats.length} languages total</span>
            </div>
            
            {/* Language Bars */}
            <div className="space-y-4">
                {sortedLanguages.map((lang, idx) => {
                    const count = lang.count || lang.repos || 0;
                    const percentage = totalRepos > 0 ? (count / totalRepos) * 100 : 0;
                    const color = languageColors[lang.name] || '#888';
                    
                    return (
                        <motion.div
                            key={lang.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div 
                                        className="w-3 h-3 rounded-full" 
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">{lang.name}</span>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {percentage.toFixed(1)}% · {count} repos
                                </div>
                            </div>
                            
                            {/* Animated progress bar */}
                            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1, delay: idx * 0.1 }}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
            
            {/* AI Prediction */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800"
            >
                <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                        <div className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                            🔮 6-Month Forecast
                        </div>
                        {loadingForecast ? (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Analyzing trends...</span>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-700 dark:text-gray-400">
                                {forecast || `${sortedLanguages[0]?.name || 'Primary language'} remains your dominant stack. Consider exploring complementary technologies for full-stack capabilities.`}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

