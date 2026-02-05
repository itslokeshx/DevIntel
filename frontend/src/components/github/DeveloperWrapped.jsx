import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function DeveloperWrapped({ wrappedData, contributions, repositories }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    if (!wrappedData && !contributions && !repositories) {
        return null;
    }
    
    const totalCommits = contributions?.totalCommits || 0;
    const totalRepos = repositories?.length || 0;
    const totalStars = repositories?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0;
    const currentStreak = contributions?.currentStreak || 0;
    const longestStreak = contributions?.longestStreak || 0;
    
    // Find peak month
    const peakMonth = contributions?.commitsByMonth?.[0]?.month || 'N/A';
    const peakCommits = contributions?.commitsByMonth?.[0]?.count || 0;
    
    const slides = [
        {
            title: "Your Year in Numbers",
            content: (
                <div className="space-y-6">
                    <div className="text-6xl font-bold text-center text-white">{totalCommits}</div>
                    <div className="text-2xl text-center text-gray-200">commits this year</div>
                    <div className="text-center text-gray-300">
                        That's {Math.round(totalCommits / 365)} per day on average
                    </div>
                </div>
            )
        },
        {
            title: "Peak Productivity",
            content: (
                <div className="space-y-4">
                    <div className="text-4xl font-bold text-center text-blue-300">
                        {peakMonth}
                    </div>
                    <div className="text-xl text-center text-gray-200">
                        Your most productive month with {peakCommits} commits
                    </div>
                    <div className="mt-6 bg-blue-500/20 rounded-lg p-4 border border-blue-400/30">
                        <div className="text-sm text-gray-200">
                            🔥 You were on fire! Consistent daily contributions throughout the month.
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Project Portfolio",
            content: (
                <div className="text-center space-y-4">
                    <div className="text-6xl font-bold text-white">{totalRepos}</div>
                    <div className="text-2xl text-gray-200">repositories created</div>
                    <div className="text-lg text-gray-300 mt-4">
                        {totalStars} total stars earned
                    </div>
                    <div className="text-sm text-gray-400 mt-4">
                        Average: {totalRepos > 0 ? (totalStars / totalRepos).toFixed(1) : 0} stars per repo
                    </div>
                </div>
            )
        },
        {
            title: "Consistency Champion",
            content: (
                <div className="text-center space-y-4">
                    <div className="text-6xl">🔥</div>
                    <div className="text-4xl font-bold text-white">{currentStreak}</div>
                    <div className="text-xl text-gray-200">day current streak</div>
                    <div className="text-lg text-gray-300 mt-4">
                        Longest streak: {longestStreak} days
                    </div>
                    <div className="text-sm text-gray-400 mt-4">
                        {currentStreak > 30 ? 'Top 8% consistency! 🎉' : 'Keep the momentum going!'}
                    </div>
                </div>
            )
        }
    ];
    
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };
    
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };
    
    return (
        <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-8 text-center">🎁 Your 2024 Wrapped</h3>
                
                {/* Slide container */}
                <div className="relative h-96 mb-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 flex flex-col items-center justify-center p-8"
                        >
                            <h4 className="text-2xl font-semibold mb-8">{slides[currentSlide].title}</h4>
                            {slides[currentSlide].content}
                        </motion.div>
                    </AnimatePresence>
                    
                    {/* Navigation buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Slide indicators */}
                <div className="flex justify-center gap-2 mb-8">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`h-2 rounded-full transition-all ${
                                idx === currentSlide ? 'bg-white w-8' : 'bg-white/30 w-2'
                            }`}
                        />
                    ))}
                </div>
                
                {/* Share button */}
                <div className="flex justify-center">
                    <button className="bg-white text-purple-900 px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform">
                        Share Your Wrapped 📸
                    </button>
                </div>
            </div>
        </div>
    );
}

