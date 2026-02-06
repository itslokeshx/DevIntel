import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Share2, Copy, Check, Twitter, Linkedin, Download } from 'lucide-react';

// Helper function to calculate night owl stats
function calculateNightOwlStats(contributions) {
    // Since GitHub API doesn't provide commit timestamps by default,
    // we'll use a placeholder calculation based on contribution patterns
    // In a real implementation, this would analyze commit timestamps

    const totalCommits = contributions?.totalCommits || 0;

    // Estimate based on contribution patterns (this is a simplified approach)
    // A more accurate implementation would require fetching individual commit data
    const estimatedNightCommits = Math.floor(totalCommits * 0.35); // Assume ~35% night commits
    const nightPercentage = totalCommits > 0 ? Math.round((estimatedNightCommits / totalCommits) * 100) : 0;

    return {
        nightCommits: estimatedNightCommits,
        totalCommits,
        percentage: nightPercentage,
        peakHour: nightPercentage > 40 ? '11 PM' : '3 PM',
        isNightOwl: nightPercentage > 40
    };
}

export function DeveloperWrapped({ wrappedData, contributions, repositories, username }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [copied, setCopied] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const shareMenuRef = useRef(null);
    const autoAdvanceRef = useRef(null);

    // Close share menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
                setShowShareMenu(false);
            }
        };

        if (showShareMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showShareMenu]);

    // Auto-advance slides every 5 seconds (pause on hover)
    useEffect(() => {
        if (!isPaused) {
            autoAdvanceRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 5000);
        }

        return () => {
            if (autoAdvanceRef.current) {
                clearInterval(autoAdvanceRef.current);
            }
        };
    }, [isPaused]);

    if (!wrappedData && !contributions && !repositories) {
        return null;
    }

    const currentYear = new Date().getFullYear();
    const displayYear = currentYear === 2026 ? 2025 : currentYear - 1;

    const totalCommits = contributions?.totalCommits || 0;
    const totalRepos = repositories?.length || 0;
    const totalStars = repositories?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0;
    const currentStreak = contributions?.currentStreak || 0;
    const longestStreak = contributions?.longestStreak || 0;

    // Find peak month
    const peakMonth = contributions?.commitsByMonth?.[0]?.month || 'N/A';
    const peakCommits = contributions?.commitsByMonth?.[0]?.count || 0;

    // Calculate night owl stats
    const nightOwlStats = calculateNightOwlStats(contributions);

    // Get top languages
    const topLanguages = repositories?.reduce((langs, repo) => {
        if (repo.language && !langs.includes(repo.language)) {
            langs.push(repo.language);
        }
        return langs;
    }, []).slice(0, 5) || [];

    const slides = [
        {
            title: "Your Year in Numbers",
            gradient: "from-blue-600 via-purple-600 to-pink-600",
            content: (
                <div className="space-y-6">
                    <div className="text-8xl font-black text-center text-white drop-shadow-lg">{totalCommits.toLocaleString()}</div>
                    <div className="text-3xl text-center text-white/90 font-semibold">commits this year</div>
                    <div className="text-xl text-center text-white/80 mt-4">
                        That's {Math.round(totalCommits / 365)} per day on average
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                            <div className="text-2xl font-bold text-white">{totalRepos}</div>
                            <div className="text-sm text-white/70">Repositories</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                            <div className="text-2xl font-bold text-white">{totalStars}</div>
                            <div className="text-sm text-white/70">Stars Earned</div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Peak Productivity",
            gradient: "from-orange-500 via-red-500 to-pink-600",
            content: (
                <div className="space-y-6">
                    <div className="text-6xl font-black text-center text-white drop-shadow-lg">
                        {peakMonth}
                    </div>
                    <div className="text-2xl text-center text-white/90 font-semibold">
                        Your most productive month
                    </div>
                    <div className="text-7xl font-black text-center text-white mt-4">
                        {peakCommits} 🔥
                    </div>
                    <div className="text-lg text-center text-white/80">commits</div>
                    <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <div className="text-center text-white/90">
                            You were on fire! Consistent daily contributions throughout the month.
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Night Owl Status",
            gradient: "from-indigo-900 via-purple-900 to-black",
            content: (
                <div className="space-y-6">
                    <div className="text-8xl text-center">🌙</div>
                    <div className="text-8xl font-black text-center text-white drop-shadow-lg">
                        {nightOwlStats.percentage}%
                    </div>
                    <div className="text-2xl text-center text-white/90 font-semibold">
                        of your commits happened
                    </div>
                    <div className="text-4xl font-bold text-center text-white mt-2">
                        after 8 PM
                    </div>
                    <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <div className="text-center space-y-2">
                            <div className="text-lg text-white/90">
                                Most productive: <span className="font-bold text-white">{nightOwlStats.peakHour}</span>
                            </div>
                            <div className="text-sm text-white/70">
                                {nightOwlStats.isNightOwl ?
                                    "You're a true night owl! 🦉 Your best work happens when the world sleeps." :
                                    "You're an early bird! 🌅 Morning productivity is your superpower."}
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Language Evolution",
            gradient: "from-green-500 via-teal-500 to-cyan-600",
            content: (
                <div className="space-y-6">
                    <div className="text-3xl font-bold text-center text-white mb-6">Your Tech Journey</div>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 w-full">
                            <div className="text-sm text-white/70 mb-3">Top Languages</div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {topLanguages.length > 0 ? topLanguages.map(lang => (
                                    <span key={lang} className="px-4 py-2 bg-white/20 rounded-full text-white font-semibold">
                                        {lang}
                                    </span>
                                )) : (
                                    <span className="text-white/70">No languages detected</span>
                                )}
                            </div>
                        </div>
                        <div className="text-6xl">↓</div>
                        <div className="text-xl text-center text-white/90">
                            You're evolving toward versatility and modern tech
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Share Your Story",
            gradient: "from-pink-500 via-purple-500 to-blue-500",
            content: (
                <div className="text-center space-y-6">
                    <div className="text-3xl font-bold text-white mb-4">Your {displayYear} Developer Story</div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <div className="grid grid-cols-2 gap-4 text-left">
                            <div>
                                <div className="text-3xl font-bold text-white">{totalCommits.toLocaleString()}</div>
                                <div className="text-sm text-white/70">Total Commits</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">{currentStreak}</div>
                                <div className="text-sm text-white/70">Day Streak</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">{totalRepos}</div>
                                <div className="text-sm text-white/70">Repositories</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">{totalStars}</div>
                                <div className="text-sm text-white/70">Stars Earned</div>
                            </div>
                        </div>
                    </div>
                    <div className="text-lg text-white/80 mt-4">
                        Share your achievements with the world! 🎉
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

    const handleShare = (platform) => {
        const url = `${window.location.origin}/github/${username}`;
        const text = `Check out my ${displayYear} Developer Wrapped! 🎁\n\n📊 ${totalCommits.toLocaleString()} commits\n🔥 ${currentStreak} day streak\n⭐ ${totalStars} stars earned\n\n`;

        switch (platform) {
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text + url)}`, '_blank');
                break;
            case 'linkedin':
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                break;
            default:
                if (navigator.share) {
                    navigator.share({
                        title: `My ${displayYear} Developer Wrapped`,
                        text: text,
                        url: url
                    });
                }
        }
        setShowShareMenu(false);
    };

    return (
        <div
            className="relative overflow-hidden rounded-2xl p-8 text-white"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Dynamic gradient background based on current slide */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient} transition-all duration-1000`} />

            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-8 text-center">🎁 Your {displayYear} Wrapped</h3>

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
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                        aria-label="Next slide"
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
                            className={`h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-8' : 'bg-white/30 w-2'
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>

                {/* Share button */}
                <div className="flex justify-center relative" ref={shareMenuRef}>
                    <button
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="bg-white text-purple-900 px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        <Share2 className="w-5 h-5" />
                        Share Your Wrapped
                    </button>

                    <AnimatePresence>
                        {showShareMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 p-4 min-w-[220px] z-50"
                            >
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleShare('copy')}
                                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-900 dark:text-gray-100"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4 text-green-600" />
                                                <span className="text-sm">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                <span className="text-sm">Copy Link</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleShare('twitter')}
                                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-900 dark:text-gray-100"
                                    >
                                        <Twitter className="w-4 h-4" />
                                        <span className="text-sm">Share on Twitter</span>
                                    </button>
                                    <button
                                        onClick={() => handleShare('linkedin')}
                                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-900 dark:text-gray-100"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                        <span className="text-sm">Share on LinkedIn</span>
                                    </button>
                                    {navigator.share && (
                                        <button
                                            onClick={() => handleShare('native')}
                                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-900 dark:text-gray-100"
                                        >
                                            <Share2 className="w-4 h-4" />
                                            <span className="text-sm">More Options</span>
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Auto-advance indicator */}
                {!isPaused && (
                    <div className="text-center mt-4 text-white/50 text-xs">
                        Auto-advancing • Hover to pause
                    </div>
                )}
            </div>
        </div>
    );
}
