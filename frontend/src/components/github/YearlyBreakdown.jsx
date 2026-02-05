import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export function YearlyBreakdown({ yearlyBreakdown, contributions }) {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(yearlyBreakdown?.[0]?.year || currentYear);
    
    if (!yearlyBreakdown || yearlyBreakdown.length === 0) {
        return null;
    }
    
    const currentYearData = yearlyBreakdown.find(y => y.year === selectedYear) || yearlyBreakdown[0];
    
    // Generate monthly data for selected year
    const monthlyCommits = contributions?.commitsByMonth
        ?.filter(({ month }) => month.startsWith(selectedYear.toString()))
        .map(({ month, count }) => ({
            month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
            commits: count
        })) || [];
    
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">📜 Developer Timeline</h3>
            
            {/* Year tabs */}
            <div className="flex gap-2 mb-8 flex-wrap">
                {yearlyBreakdown.map(({ year }) => (
                    <button
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                            selectedYear === year
                                ? 'bg-blue-600 text-white shadow-lg scale-105'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                        {year}
                    </button>
                ))}
            </div>
            
            {/* Year stats */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedYear}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="space-y-6">
                        {/* Main metrics grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6">
                                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{currentYearData.repos}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Repositories</div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6">
                                <div className="text-4xl font-bold text-green-600 dark:text-green-400">{currentYearData.commits}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Commits</div>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-6">
                                <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">{currentYearData.stars}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Stars Earned</div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6">
                                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">{currentYearData.streak}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Best Streak</div>
                            </div>
                        </div>
                        
                        {/* Story narrative */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                            <h4 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">📖 {selectedYear} Story</h4>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                In {selectedYear}, you launched {currentYearData.repos} projects with {currentYearData.commits} commits. 
                                {currentYearData.topLanguage && ` Your primary focus was ${currentYearData.topLanguage},`} demonstrating {currentYearData.commits > 100 ? 'exceptional' : 'steady'} 
                                consistency. {currentYearData.streak > 20 ? `A remarkable ${currentYearData.streak}-day streak showed unwavering dedication.` : ''}
                            </p>
                        </div>
                        
                        {/* Monthly breakdown chart */}
                        {monthlyCommits.length > 0 && (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyCommits}>
                                        <XAxis dataKey="month" stroke="#888" />
                                        <YAxis stroke="#888" />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#1f2937', 
                                                border: '1px solid #374151',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Bar dataKey="commits" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

