import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowRight, Zap, Brain, TrendingUp } from "lucide-react";

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
    <div className="min-h-screen bg-[var(--bg-primary)] relative">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--accent)] opacity-[0.03] blur-[120px] rounded-full" />
      </div>

      {/* ═══ HERO ═══ */}
      <section className="relative max-w-2xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 md:pt-40 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Minimal badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-6 text-[11px] font-medium text-[var(--text-tertiary)] border border-[var(--border-default)] rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            AI-powered developer analysis
          </div>

          {/* Clean headline */}
          <h1 className="text-[32px] sm:text-5xl md:text-6xl font-semibold text-[var(--text-primary)] leading-[1.1] tracking-[-0.03em] mb-4">
            Decode your{" "}
            <span className="gradient-text">developer DNA</span>
          </h1>

          <p className="text-[15px] sm:text-base text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
            AI-powered GitHub analytics that reveal your unique coding patterns, strengths, and growth opportunities.
          </p>
        </motion.div>

        {/* ═══ SEARCH ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full max-w-md mx-auto mb-4"
        >
          <div className="relative bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-default)] focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_var(--accent-muted)] transition-all duration-200">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
            <input
              type="text"
              value={githubUsername}
              onChange={(e) => {
                setGithubUsername(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder="Enter GitHub username"
              disabled={loading}
              className="w-full h-11 pl-10 pr-24 text-sm bg-transparent text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none disabled:opacity-60"
              aria-label="GitHub username"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !githubUsername.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-3.5 bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-medium rounded-lg transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {loading ? (
                <div className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              ) : (
                <>
                  <span>Analyze</span>
                  <ArrowRight className="w-3 h-3" />
                </>
              )}
            </button>
          </div>

          {error && (
            <p className="mt-2.5 text-xs text-red-500 text-center" role="alert">
              {error}
            </p>
          )}
        </motion.div>

        {/* Quick examples */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xs text-[var(--text-tertiary)]"
        >
          <span className="mr-1.5">Try:</span>
          {exampleUsers.map((user, i) => (
            <React.Fragment key={user}>
              <button
                onClick={() => {
                  setGithubUsername(user);
                  navigate(`/github/${user}`);
                }}
                className="text-[var(--accent)] font-medium hover:underline underline-offset-2"
              >
                {user}
              </button>
              {i < exampleUsers.length - 1 && (
                <span className="mx-1.5 text-[var(--border-strong)]">·</span>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard
            icon={<Zap className="w-4 h-4" />}
            title="Real-Time Data"
            description="Live GitHub data — no caching, no simulations."
            delay={0}
          />
          <FeatureCard
            icon={<Brain className="w-4 h-4" />}
            title="AI Insights"
            description="Discover your developer archetype and hidden patterns."
            delay={0.08}
          />
          <FeatureCard
            icon={<TrendingUp className="w-4 h-4" />}
            title="Growth Map"
            description="Personalized recommendations to amplify your impact."
            delay={0.16}
          />
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="max-w-xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center p-8 sm:p-12 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] mb-2">
            Ready to see your story?
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Uncover insights about your developer journey
          </p>
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setTimeout(() => document.querySelector("input")?.focus(), 500);
            }}
            className="px-6 py-2.5 text-sm font-medium bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg hover:opacity-90 transition-opacity"
          >
            Get Started
          </button>
        </motion.div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay }}
      className="group p-5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] hover:border-[var(--border-strong)] transition-all duration-200"
    >
      <div className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center mb-3 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
        {title}
      </h3>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
