import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Loader2, Swords, ArrowRight } from "lucide-react";

export function BattleArenaSetup({ onBattleStart, loading: externalLoading }) {
  const [fighterA, setFighterA] = useState("");
  const [fighterB, setFighterB] = useState("");
  const [error, setError] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  const loading = externalLoading || localLoading;

  const handleStartBattle = () => {
    if (!fighterA.trim() || !fighterB.trim()) {
      setError("Both usernames are required");
      return;
    }
    if (fighterA.trim().toLowerCase() === fighterB.trim().toLowerCase()) {
      setError("Please select two different users");
      return;
    }
    setError("");
    setLocalLoading(true);
    onBattleStart(fighterA.trim(), fighterB.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && fighterA && fighterB && !loading) {
      handleStartBattle();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-14 flex flex-col items-center justify-center p-4 sm:p-6 relative">
      {/* Subtle ambient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--accent)] opacity-[0.02] blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-[var(--bg-tertiary)] rounded-xl mb-4 border border-[var(--border-default)]">
            <Swords className="w-5 h-5 text-[var(--text-secondary)]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mb-2 tracking-[-0.02em]">
            Developer Battle
          </h1>
          <p className="text-sm text-[var(--text-tertiary)] max-w-md mx-auto">
            Compare coding styles, contributions, and tech stacks head-to-head
          </p>
        </div>

        {/* Battle Card */}
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 sm:p-7">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5">
            <div className="flex-1 w-full">
              <FighterInput
                value={fighterA}
                onChange={setFighterA}
                onKeyPress={handleKeyPress}
                placeholder="Username A"
                disabled={loading}
              />
            </div>

            <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-tertiary)] text-xs font-semibold flex-shrink-0 border border-[var(--border-subtle)]">
              VS
            </div>

            <div className="flex-1 w-full">
              <FighterInput
                value={fighterB}
                onChange={setFighterB}
                onKeyPress={handleKeyPress}
                placeholder="Username B"
                disabled={loading}
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-xs text-center mt-3"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            onClick={handleStartBattle}
            disabled={loading || !fighterA || !fighterB}
            className="w-full mt-5 px-5 py-2.5 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:opacity-90 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Start Battle
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <p className="text-center text-[var(--text-tertiary)] text-[10px] mt-3">
            Press Enter to begin · Data from GitHub API
          </p>
        </div>

        {/* Quick picks */}
        <div className="mt-6 text-center">
          <p className="text-[var(--text-tertiary)] text-xs mb-2.5">Try:</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {["torvalds", "gvanrossum", "tj", "sindresorhus"].map((name) => (
              <button
                key={name}
                onClick={() =>
                  !fighterA ? setFighterA(name) : setFighterB(name)
                }
                disabled={loading}
                className="px-2.5 py-1 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] bg-[var(--bg-tertiary)] hover:bg-[var(--surface-hover)] rounded-md border border-[var(--border-subtle)] transition-colors disabled:opacity-50"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function FighterInput({ value, onChange, onKeyPress, placeholder, disabled }) {
  return (
    <div className="space-y-2 text-center">
      <div className="w-14 h-14 mx-auto rounded-xl overflow-hidden bg-[var(--bg-tertiary)] border border-[var(--border-default)]">
        {value ? (
          <img
            src={`https://github.com/${value}.png`}
            alt={value}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)]">
            <User className="w-6 h-6" />
          </div>
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full text-center bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-muted)] transition-all"
      />
      {value && (
        <p className="text-[10px] text-[var(--text-tertiary)]">@{value}</p>
      )}
    </div>
  );
}
