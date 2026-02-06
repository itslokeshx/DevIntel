import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Zap, Brain, TrendingUp } from "lucide-react";

export function Home() {
  const navigate = useNavigate();
  const [githubUsername, setGithubUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!githubUsername.trim()) {
      setError("GitHub username is required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      navigate(`/github/${githubUsername.trim()}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const exampleUsers = ["torvalds", "gvanrossum", "tj"];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* ═══ Animated Background Orbs ═══ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] animate-slow-rotate" />
        <div
          className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] animate-slow-rotate"
          style={{ animationDirection: "reverse" }}
        />
      </div>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative max-w-content mx-auto px-4 sm:px-6 lg:px-12 pt-20 sm:pt-24 md:pt-20 pb-6 sm:pb-10 text-center">
        {/* Premium Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-5 sm:mb-6 bg-blue-50 dark:bg-blue-500/10 border border-blue-200/50 dark:border-blue-500/20 rounded-full"
        >
          <Zap className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          <span className="text-[10px] sm:text-xs font-semibold text-blue-700 dark:text-blue-300">
            AI-Powered Analysis
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[28px] leading-[1.15] sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-gray-50 sm:leading-[1.1] tracking-tight mb-3 sm:mb-5 px-2"
        >
          Decode Your{" "}
          <span className="inline-block gradient-text animate-gradient">
            Developer DNA
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-[13px] leading-[1.5] sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-[280px] sm:max-w-[500px] mx-auto mb-6 sm:mb-8"
        >
          AI-powered GitHub insights and analytics
        </motion.p>

        {/* ═══ SEARCH INPUT ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full max-w-[300px] sm:max-w-[480px] md:max-w-[550px] mx-auto mb-4 sm:mb-6 relative"
        >
          {/* Glass Card Wrapper */}
          <div className="relative bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border-2 border-gray-200 dark:border-gray-800 focus-within:border-blue-500 dark:focus-within:border-blue-500 transition-colors">
            {/* Search icon */}
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />

            {/* Input */}
            <input
              type="text"
              value={githubUsername}
              onChange={(e) => {
                setGithubUsername(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder="username"
              disabled={loading}
              className="w-full h-11 sm:h-12 pl-10 sm:pl-12 pr-20 sm:pr-24 text-sm sm:text-base bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none transition-all disabled:opacity-60"
              aria-label="GitHub username"
            />

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !githubUsername.trim()}
              className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 h-8 sm:h-8 px-3 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Go</span>
                  <Zap className="w-3 h-3" />
                </>
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p
              className="mt-3 text-sm text-red-500 dark:text-red-400 text-center"
              role="alert"
            >
              {error}
            </p>
          )}
        </motion.div>

        {/* ═══ QUICK EXAMPLES ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-[11px] sm:text-xs text-center text-gray-500 dark:text-gray-500"
        >
          <span className="mr-1.5">Try:</span>
          {exampleUsers.map((user, i) => (
            <React.Fragment key={user}>
              <button
                onClick={() => {
                  setGithubUsername(user);
                  navigate(`/github/${user}`);
                }}
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                {user}
              </button>
              {i < exampleUsers.length - 1 && <span className="mx-1.5">•</span>}
            </React.Fragment>
          ))}
        </motion.div>
      </section>

      {/* ═══ FEATURE CARDS ═══ */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-12 mb-12 sm:mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          <FeatureCard
            icon={<Zap className="w-9 h-9 text-white" />}
            gradient="from-blue-500 to-blue-600"
            title="Real-Time Intelligence"
            description="100% live data from GitHub. No caching, no simulations—see your exact current state instantly."
            delay={0}
          />
          <FeatureCard
            icon={<Brain className="w-9 h-9 text-white" />}
            gradient="from-purple-500 to-purple-700"
            title="AI-Powered Insights"
            description="Advanced AI analyzes your work to reveal your developer archetype and hidden patterns."
            delay={0.1}
          />
          <FeatureCard
            icon={<TrendingUp className="w-9 h-9 text-white" />}
            gradient="from-pink-500 to-pink-700"
            title="Growth Roadmap"
            description="Personalized, actionable recommendations to amplify your impact and visibility."
            delay={0.2}
          />
        </div>
      </section>

      {/* ═══ SOCIAL PROOF ═══ */}
      <section className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-12 mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-3xl p-8 sm:p-16 text-center"
        >
          {/* Avatar stack */}
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-full border-[3px] border-white dark:border-gray-900 bg-gradient-to-br ${
                  i % 3 === 0
                    ? "from-blue-400 to-blue-600"
                    : i % 3 === 1
                      ? "from-purple-400 to-purple-600"
                      : "from-pink-400 to-pink-600"
                } shadow-md ${i > 1 ? "-ml-3" : ""}`}
              />
            ))}
          </div>

          <h2 className="text-2xl sm:text-heading-xl font-bold text-gray-900 dark:text-white mb-4">
            Join 50,000+ Developers
          </h2>
          <p className="text-body-md text-gray-500 dark:text-gray-400">
            Analyzing their GitHub DNA every day
          </p>
        </motion.div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-12 mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-2xl sm:rounded-3xl p-8 sm:p-16 text-center overflow-hidden animate-gradient"
          style={{ backgroundSize: "200% 200%" }}
        >
          <h2 className="text-2xl sm:text-display-md text-white font-bold mb-3 sm:mb-4 drop-shadow-lg relative z-10">
            Ready to see your developer story?
          </h2>
          <p className="text-base sm:text-xl text-white/90 mb-6 sm:mb-8 relative z-10 px-2">
            Uncover insights that will change how you see your work
          </p>
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setTimeout(() => document.querySelector("input")?.focus(), 500);
            }}
            className="relative z-10 bg-white text-blue-600 px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-bold rounded-xl shadow-xl hover:scale-105 hover:shadow-2xl active:scale-[0.98] transition-all duration-200"
          >
            Analyze Your Profile Now
          </button>
        </motion.div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, gradient, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[20px] p-5 sm:p-8 md:p-12 text-center hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 group"
    >
      {/* Icon container */}
      <div
        className={`w-14 h-14 sm:w-[72px] sm:h-[72px] mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>

      <h3 className="text-lg sm:text-[22px] font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
        {title}
      </h3>
      <p className="text-sm sm:text-body-md text-gray-500 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
