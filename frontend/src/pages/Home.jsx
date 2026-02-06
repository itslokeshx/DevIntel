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
      <section className="relative max-w-content mx-auto px-6 lg:px-12 pt-40 pb-30 text-center">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[56px] md:text-[72px] lg:text-[80px] font-extrabold text-gray-900 dark:text-gray-50 leading-[1.05] tracking-tight mb-6"
        >
          Decode Your <span className="gradient-text">Developer DNA</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg md:text-[22px] text-gray-500 dark:text-gray-400 max-w-[700px] mx-auto leading-relaxed mb-16"
        >
          Transform your GitHub activity into meaningful insights, growth
          patterns, and personalized recommendations.
        </motion.p>

        {/* ═══ SEARCH INPUT ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-[680px] mx-auto mb-6 relative"
        >
          <div className="relative">
            {/* Search icon */}
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />

            {/* Input */}
            <input
              type="text"
              value={githubUsername}
              onChange={(e) => {
                setGithubUsername(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder="Enter GitHub username..."
              disabled={loading}
              className="w-full h-[72px] pl-16 pr-[180px] text-lg bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white dark:focus:bg-gray-900 transition-all duration-200 disabled:opacity-60"
              aria-label="GitHub username"
            />

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !githubUsername.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-14 px-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-blue hover:shadow-blue-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze"
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
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm text-center mb-32"
        >
          <span className="text-gray-400 mr-3">Try:</span>
          {exampleUsers.map((user, i) => (
            <React.Fragment key={user}>
              <button
                onClick={() => {
                  setGithubUsername(user);
                  navigate(`/github/${user}`);
                }}
                className="text-blue-500 dark:text-blue-400 font-medium hover:underline transition-colors"
              >
                {user}
              </button>
              {i < exampleUsers.length - 1 && (
                <span className="text-gray-300 dark:text-gray-600 mx-3">•</span>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </section>

      {/* ═══ FEATURE CARDS ═══ */}
      <section className="max-w-content mx-auto px-6 lg:px-12 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      <section className="max-w-[800px] mx-auto px-6 lg:px-12 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-3xl p-16 text-center"
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

          <h2 className="text-heading-xl font-bold text-gray-900 dark:text-white mb-4">
            Join 50,000+ Developers
          </h2>
          <p className="text-body-md text-gray-500 dark:text-gray-400">
            Analyzing their GitHub DNA every day
          </p>
        </motion.div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="max-w-[1000px] mx-auto px-6 lg:px-12 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-3xl p-16 text-center overflow-hidden animate-gradient"
          style={{ backgroundSize: "200% 200%" }}
        >
          <h2 className="text-display-md text-white font-bold mb-4 drop-shadow-lg relative z-10">
            Ready to see your developer story?
          </h2>
          <p className="text-xl text-white/90 mb-8 relative z-10">
            Uncover insights that will change how you see your work
          </p>
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setTimeout(() => document.querySelector("input")?.focus(), 500);
            }}
            className="relative z-10 bg-white text-blue-600 px-12 py-5 text-lg font-bold rounded-xl shadow-xl hover:scale-105 hover:shadow-2xl active:scale-[0.98] transition-all duration-200"
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
      whileHover={{ y: -8 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[20px] p-12 text-center hover:shadow-2xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 group"
    >
      {/* Icon container */}
      <div
        className={`w-[72px] h-[72px] mx-auto mb-6 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>

      <h3 className="text-[22px] font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-body-md text-gray-500 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
