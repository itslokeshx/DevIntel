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
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target)
      ) {
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

  // Use the current year for the wrapped — this shows the user's data as of right now
  const currentYear = new Date().getFullYear();

  const totalCommits = contributions?.totalCommits || 0;
  const totalRepos = repositories?.length || 0;
  const totalStars =
    repositories?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0;
  const currentStreak = contributions?.currentStreak || 0;
  const longestStreak = contributions?.longestStreak || 0;

  // Find actual peak month from available data
  const sortedMonths = [...(contributions?.commitsByMonth || [])].sort(
    (a, b) => b.count - a.count,
  );
  const peakMonthData = sortedMonths[0];
  const peakMonthLabel = peakMonthData
    ? new Date(peakMonthData.month + "-01").toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "N/A";
  const peakCommits = peakMonthData?.count || 0;

  const topLanguages =
    repositories
      ?.reduce((langs, repo) => {
        if (repo.language && !langs.includes(repo.language))
          langs.push(repo.language);
        return langs;
      }, [])
      .slice(0, 5) || [];

  const slides = [
    {
      label: "Overview",
      content: (
        <div className="space-y-5 w-full max-w-sm mx-auto">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-semibold text-[var(--text-primary)] tracking-tight">
              {totalCommits.toLocaleString()}
            </div>
            <div className="text-sm text-[var(--text-secondary)] mt-1">
              total commits
            </div>
            <div className="text-xs text-[var(--text-tertiary)] mt-0.5">
              ~{Math.round(totalCommits / 365)} per day average
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[var(--bg-tertiary)] rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-[var(--text-primary)]">{totalRepos}</div>
              <div className="text-[10px] text-[var(--text-tertiary)]">Repos</div>
            </div>
            <div className="bg-[var(--bg-tertiary)] rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-[var(--text-primary)]">{totalStars}</div>
              <div className="text-[10px] text-[var(--text-tertiary)]">Stars</div>
            </div>
            <div className="bg-[var(--bg-tertiary)] rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-[var(--text-primary)]">
                {longestStreak}
              </div>
              <div className="text-[10px] text-[var(--text-tertiary)]">Best Streak</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Peak Month",
      content: (
        <div className="space-y-3 w-full max-w-sm mx-auto text-center">
          <div className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
            {peakMonthLabel}
          </div>
          <div className="text-xs text-[var(--text-tertiary)]">
            most productive month
          </div>
          <div className="text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] mt-2">
            {peakCommits}
          </div>
          <div className="text-xs text-[var(--text-tertiary)]">commits that month</div>
        </div>
      ),
    },
    {
      label: "Tech Stack",
      content: (
        <div className="space-y-4 w-full max-w-sm mx-auto text-center">
          <div className="text-sm font-medium text-[var(--text-secondary)] mb-3">
            Your Languages
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {topLanguages.length > 0 ? (
              topLanguages.map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1.5 bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-full text-[var(--text-primary)] text-xs font-medium"
                >
                  {lang}
                </span>
              ))
            ) : (
              <span className="text-[var(--text-tertiary)] text-xs">
                No languages detected
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      label: "Summary",
      content: (
        <div className="w-full max-w-sm mx-auto text-center space-y-4">
          <div className="text-sm font-medium text-[var(--text-secondary)]">
            {currentYear} Developer Summary
          </div>
          <div className="bg-[var(--bg-tertiary)] rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3 text-left">
              <div>
                <div className="text-xl font-semibold text-[var(--text-primary)]">
                  {totalCommits.toLocaleString()}
                </div>
                <div className="text-[10px] text-[var(--text-tertiary)]">Commits</div>
              </div>
              <div>
                <div className="text-xl font-semibold text-[var(--text-primary)]">
                  {longestStreak}
                </div>
                <div className="text-[10px] text-[var(--text-tertiary)]">Best Streak</div>
              </div>
              <div>
                <div className="text-xl font-semibold text-[var(--text-primary)]">
                  {totalRepos}
                </div>
                <div className="text-[10px] text-[var(--text-tertiary)]">Repositories</div>
              </div>
              <div>
                <div className="text-xl font-semibold text-[var(--text-primary)]">
                  {totalStars}
                </div>
                <div className="text-[10px] text-[var(--text-tertiary)]">Stars</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleShare = (platform) => {
    const url = `${window.location.origin}/github/${username}`;
    const text = `My ${currentYear} Developer Wrapped! 🎁\n📊 ${totalCommits.toLocaleString()} commits\n🔥 ${longestStreak} day streak\n⭐ ${totalStars} stars\n\n`;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + url)}`,
          "_blank",
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank",
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: `My ${currentYear} Developer Wrapped`,
            text,
            url,
          });
        }
    }
    setShowShareMenu(false);
  };

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[var(--bg-tertiary)] flex items-center justify-center text-sm">
              📊
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              {currentYear} Wrapped
            </h3>
          </div>
          <div className="flex items-center gap-1">
            {slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-all ${
                  idx === currentSlide
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Slide content */}
        <div className="relative h-52 sm:h-56 mb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center px-4"
            >
              {slides[currentSlide].content}
            </motion.div>
          </AnimatePresence>

          {/* Nav arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--surface-hover)] transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--surface-hover)] transition-all"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Share */}
        <div className="flex justify-center relative" ref={shareMenuRef}>
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-tertiary)] hover:bg-[var(--surface-hover)] rounded-lg border border-[var(--border-default)] transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>

          <AnimatePresence>
            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                className="absolute top-full mt-2 bg-[var(--bg-elevated)] rounded-xl shadow-lg border border-[var(--border-default)] p-2 min-w-[180px] z-50"
              >
                <div className="space-y-0.5">
                  <button
                    onClick={() => handleShare("copy")}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[var(--surface-hover)] rounded-lg transition-colors text-[var(--text-primary)]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-xs">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-xs">Copy Link</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleShare("twitter")}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[var(--surface-hover)] rounded-lg transition-colors text-[var(--text-primary)]"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                    <span className="text-xs">Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[var(--surface-hover)] rounded-lg transition-colors text-[var(--text-primary)]"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span className="text-xs">LinkedIn</span>
                  </button>
                  {typeof navigator !== "undefined" && navigator.share && (
                    <button
                      onClick={() => handleShare("native")}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[var(--surface-hover)] rounded-lg transition-colors text-[var(--text-primary)]"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="text-xs">More</span>
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
