import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Loader2, Swords } from "lucide-react";

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
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-[72px] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Floating decorative orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-32 left-10 w-72 h-72 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-blue"
          >
            <Swords className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Developer Battle
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
            Compare coding styles, contribution patterns, and tech stacks
            head-to-head.
          </p>
        </div>

        {/* Battle Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[20px] p-8 md:p-10 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-6">
            {/* Fighter A */}
            <div className="flex-1 w-full">
              <FighterInput
                value={fighterA}
                onChange={setFighterA}
                onKeyPress={handleKeyPress}
                placeholder="Fighter One"
                disabled={loading}
              />
            </div>

            {/* VS */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-blue"
            >
              VS
            </motion.div>

            {/* Fighter B */}
            <div className="flex-1 w-full">
              <FighterInput
                value={fighterB}
                onChange={setFighterB}
                onKeyPress={handleKeyPress}
                placeholder="Fighter Two"
                disabled={loading}
              />
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 dark:text-red-400 text-sm text-center mt-4"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Start Battle */}
          <button
            onClick={handleStartBattle}
            disabled={loading || !fighterA || !fighterB}
            className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-blue"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Swords className="w-5 h-5" />
                Start Battle
              </>
            )}
          </button>

          <p className="text-center text-gray-400 dark:text-gray-500 text-xs mt-4">
            Press Enter to begin • Data from GitHub API
          </p>
        </div>

        {/* Quick picks */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-3">Try:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["torvalds", "gvanrossum", "tj", "sindresorhus"].map((name) => (
              <button
                key={name}
                onClick={() =>
                  !fighterA ? setFighterA(name) : setFighterB(name)
                }
                disabled={loading}
                className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
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
    <div className="space-y-3 text-center">
      <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
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
          <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-500">
            <User className="w-8 h-8" />
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
        className="w-full text-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl px-4 py-3 text-lg font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors"
      />
      {value && (
        <p className="text-xs text-gray-400 dark:text-gray-500">@{value}</p>
      )}
    </div>
  );
}
