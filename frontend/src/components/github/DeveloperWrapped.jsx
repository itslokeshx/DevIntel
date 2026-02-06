import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  Copy,
  Check,
  Twitter,
  Linkedin,
} from "lucide-react";

export function DeveloperWrapped({
  wrappedData,
  contributions,
  repositories,
  username,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const shareMenuRef = useRef(null);
  const autoAdvanceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
    };
    if (showShareMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showShareMenu]);

  useEffect(() => {
    if (!isPaused) {
      autoAdvanceRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => {
      if (autoAdvanceRef.current) clearInterval(autoAdvanceRef.current);
    };
  }, [isPaused]);

  if (!wrappedData && !contributions && !repositories) return null;

  const currentYear = new Date().getFullYear();
  const displayYear = currentYear === 2026 ? 2025 : currentYear - 1;

  const totalCommits = contributions?.totalCommits || 0;
  const totalRepos = repositories?.length || 0;
  const totalStars = repositories?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0;
  const currentStreak = contributions?.currentStreak || 0;
  const longestStreak = contributions?.longestStreak || 0;

  // Find actual peak month
  const sortedMonths = [...(contributions?.commitsByMonth || [])].sort((a, b) => b.count - a.count);
  const peakMonthData = sortedMonths[0];
  const peakMonthLabel = peakMonthData
    ? new Date(peakMonthData.month + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "N/A";
  const peakCommits = peakMonthData?.count || 0;

  const topLanguages = repositories
    ?.reduce((langs, repo) => {
      if (repo.language && !langs.includes(repo.language)) langs.push(repo.language);
      return langs;
    }, [])
    .slice(0, 5) || [];

  const slides = [
    {
      title: "Your Year in Numbers",
      gradient: "from-blue-600 via-purple-600 to-pink-600",
      content: (
        <div className="space-y-4 w-full max-w-sm mx-auto">
          <div className="text-5xl sm:text-6xl font-black text-center text-white">
            {totalCommits.toLocaleString()}
          </div>
          <div className="text-lg text-center text-white/90 font-medium">
            commits this year
          </div>
          <div className="text-sm text-center text-white/70">
            ~{Math.round(totalCommits / 365)} per day average
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/15 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-white">{totalRepos}</div>
              <div className="text-[10px] text-white/70">Repos</div>
            </div>
            <div className="bg-white/15 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-white">{totalStars}</div>
              <div className="text-[10px] text-white/70">Stars</div>
            </div>
            <div className="bg-white/15 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-white">{longestStreak}</div>
              <div className="text-[10px] text-white/70">Best Streak</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Peak Month",
      gradient: "from-orange-500 via-red-500 to-pink-600",
      content: (
        <div className="space-y-4 w-full max-w-sm mx-auto text-center">
          <div className="text-4xl sm:text-5xl font-black text-white">
            {peakMonthLabel}
          </div>
          <div className="text-sm text-white/80">was your most productive month</div>
          <div className="text-5xl font-black text-white mt-2">
            {peakCommits} 🔥
          </div>
          <div className="text-sm text-white/70">commits that month</div>
        </div>
      ),
    },
    {
      title: "Tech Stack",
      gradient: "from-green-500 via-teal-500 to-cyan-600",
      content: (
        <div className="space-y-4 w-full max-w-sm mx-auto text-center">
          <div className="text-lg font-bold text-white mb-4">
            Your Languages
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {topLanguages.length > 0 ? (
              topLanguages.map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1.5 bg-white/20 rounded-full text-white text-sm font-medium"
                >
                  {lang}
                </span>
              ))
            ) : (
              <span className="text-white/70 text-sm">No languages detected</span>
            )}
          </div>
          <div className="text-sm text-white/80 mt-4">
            Versatile & modern tech stack
          </div>
        </div>
      ),
    },
    {
      title: "Share Your Story",
      gradient: "from-pink-500 via-purple-500 to-blue-500",
      content: (
        <div className="w-full max-w-sm mx-auto text-center space-y-4">
          <div className="text-lg font-bold text-white">
            {displayYear} Developer Story
          </div>
          <div className="bg-white/15 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3 text-left">
              <div>
                <div className="text-2xl font-bold text-white">
                  {totalCommits.toLocaleString()}
                </div>
                <div className="text-[10px] text-white/70">Commits</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{longestStreak}</div>
                <div className="text-[10px] text-white/70">Best Streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{totalRepos}</div>
                <div className="text-[10px] text-white/70">Repositories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{totalStars}</div>
                <div className="text-[10px] text-white/70">Stars</div>
              </div>
            </div>
          </div>
          <div className="text-sm text-white/80">
            Share your achievements! 🎉
          </div>
        </div>
      ),
    },
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleShare = (platform) => {
    const url = `${window.location.origin}/github/${username}`;
    const text = `My ${displayYear} Developer Wrapped! 🎁\n📊 ${totalCommits.toLocaleString()} commits\n🔥 ${longestStreak} day streak\n⭐ ${totalStars} stars\n\n`;

    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text + url)}`, "_blank");
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
      default:
        if (navigator.share) {
          navigator.share({ title: `My ${displayYear} Developer Wrapped`, text, url });
        }
    }
    setShowShareMenu(false);
  };

  return (
    <div
      className="relative overflow-hidden rounded-[24px] text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient} transition-all duration-700`} />

      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-6 sm:p-8">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center">
          🎁 Your {displayYear} Wrapped
        </h3>

        {/* Slide container - compact height */}
        <div className="relative h-64 sm:h-72 mb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8"
            >
              <h4 className="text-base sm:text-lg font-semibold mb-4 text-white/90">
                {slides[currentSlide].title}
              </h4>
              {slides[currentSlide].content}
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-all"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Slide indicators */}
        <div className="flex justify-center gap-1.5 mb-4">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentSlide ? "bg-white w-6" : "bg-white/30 w-1.5"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Share button */}
        <div className="flex justify-center relative" ref={shareMenuRef}>
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="bg-white text-purple-900 px-6 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Wrapped
          </button>

          <AnimatePresence>
            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute top-full mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 p-3 min-w-[200px] z-50"
              >
                <div className="space-y-1">
                  <button
                    onClick={() => handleShare("copy")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-900 dark:text-gray-100"
                  >
                    {copied ? (
                      <><Check className="w-4 h-4 text-green-600" /><span className="text-xs">Copied!</span></>
                    ) : (
                      <><Copy className="w-4 h-4" /><span className="text-xs">Copy Link</span></>
                    )}
                  </button>
                  <button
                    onClick={() => handleShare("twitter")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-900 dark:text-gray-100"
                  >
                    <Twitter className="w-4 h-4" /><span className="text-xs">Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-900 dark:text-gray-100"
                  >
                    <Linkedin className="w-4 h-4" /><span className="text-xs">LinkedIn</span>
                  </button>
                  {typeof navigator !== "undefined" && navigator.share && (
                    <button
                      onClick={() => handleShare("native")}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-900 dark:text-gray-100"
                    >
                      <Share2 className="w-4 h-4" /><span className="text-xs">More</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
