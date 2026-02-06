import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Zap, Sword, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function BattleArenaSetup({ onBattleStart }) {
    const [fighterA, setFighterA] = useState('');
    const [fighterB, setFighterB] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const recentSearches = ['torvalds', 'gvanrossum', 'dhh', 'tj', 'sindresorhus'];

    const handleStartBattle = async () => {
        if (!fighterA.trim() || !fighterB.trim()) {
            setError('Both fighters are required!');
            return;
        }

        if (fighterA.trim().toLowerCase() === fighterB.trim().toLowerCase()) {
            setError('Fighters must be different!');
            return;
        }

        setLoading(true);
        setError('');

        // Trigger battle start with dramatic animation
        setTimeout(() => {
            onBattleStart(fighterA.trim(), fighterB.trim());
        }, 1000);
    };

    const handleQuickSelect = (username, side) => {
        if (side === 'A') {
            setFighterA(username);
        } else {
            setFighterB(username);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden">
            {/* Animated particle background */}
            <ParticleBackground />

            {/* Main content */}
            <div className="relative z-10 container mx-auto px-6 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
                        ⚔️ BATTLE ARENA
                    </h1>
                    <p className="text-xl text-gray-400">
                        Enter the arena. Compare developers. Witness greatness.
                    </p>
                </motion.div>

                {/* Fighter selection grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto relative">
                    {/* Fighter A */}
                    <FighterInput
                        side="A"
                        color="blue"
                        value={fighterA}
                        onChange={setFighterA}
                        onQuickSelect={handleQuickSelect}
                        recentSearches={recentSearches}
                        disabled={loading}
                    />

                    {/* VS Logo - Centered between fighters */}
                    <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                        <VSLogo />
                    </div>

                    {/* Fighter B */}
                    <FighterInput
                        side="B"
                        color="purple"
                        value={fighterB}
                        onChange={setFighterB}
                        onQuickSelect={handleQuickSelect}
                        recentSearches={recentSearches}
                        disabled={loading}
                    />
                </div>

                {/* Error message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center mt-6"
                        >
                            <p className="text-red-400 text-lg">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Fight Button */}
                <AnimatePresence>
                    {fighterA && fighterB && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            className="flex justify-center mt-12"
                        >
                            <button
                                onClick={handleStartBattle}
                                disabled={loading}
                                className="group relative px-16 py-6 bg-gradient-to-r from-red-600 to-orange-600 text-white text-3xl font-black rounded-full shadow-2xl hover:shadow-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                            >
                                {/* Animated background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Button content */}
                                <span className="relative flex items-center gap-3">
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-8 h-8 animate-spin" />
                                            LOADING...
                                        </>
                                    ) : (
                                        <>
                                            <Sword className="w-8 h-8" />
                                            FIGHT!
                                            <Sword className="w-8 h-8" />
                                        </>
                                    )}
                                </span>

                                {/* Glow effect */}
                                <div className="absolute inset-0 rounded-full blur-xl bg-red-500/30 group-hover:bg-red-500/50 transition-all -z-10" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Fighter Input Component
function FighterInput({ side, color, value, onChange, onQuickSelect, recentSearches, disabled }) {
    const colorClasses = color === 'blue'
        ? 'border-blue-500 bg-blue-500/10 focus:border-blue-400'
        : 'border-purple-500 bg-purple-500/10 focus:border-purple-400';

    const ringColor = color === 'blue' ? 'border-blue-500' : 'border-purple-500';

    return (
        <motion.div
            initial={{ opacity: 0, x: side === 'A' ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center space-y-6"
        >
            {/* Fighter ring */}
            <div className={`w-64 h-64 rounded-full border-4 ${ringColor} flex items-center justify-center bg-gray-900/50 backdrop-blur-sm relative overflow-hidden`}>
                {value ? (
                    <motion.img
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        src={`https://github.com/${value}.png`}
                        alt={value}
                        className="w-56 h-56 rounded-full"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div className={`${value ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                    <User className="w-32 h-32 text-gray-600" />
                </div>

                {/* Pulsing ring effect */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute inset-0 rounded-full border-4 ${ringColor} opacity-30`}
                />
            </div>

            {/* Fighter label */}
            <div className="text-center">
                <h3 className={`text-3xl font-bold ${color === 'blue' ? 'text-blue-400' : 'text-purple-400'}`}>
                    Fighter {side}
                </h3>
            </div>

            {/* Input */}
            <div className="w-full max-w-sm">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !disabled && value && onChange(value)}
                    placeholder={`Enter ${side === 'A' ? 'first' : 'second'} username...`}
                    disabled={disabled}
                    className={`w-full px-6 py-4 bg-gray-800/50 border-2 ${colorClasses} rounded-xl text-white text-center text-xl placeholder-gray-500 focus:outline-none transition-all disabled:opacity-50`}
                />
            </div>

            {/* Quick select */}
            <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Quick select:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                    {recentSearches.slice(0, 3).map(username => (
                        <button
                            key={username}
                            onClick={() => onQuickSelect(username, side)}
                            disabled={disabled}
                            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-full transition-colors disabled:opacity-50"
                        >
                            {username}
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

// VS Logo Component
function VSLogo() {
    return (
        <div className="relative">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            >
                VS
            </motion.div>

            {/* Lightning bolts */}
            <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                className="absolute inset-0"
            >
                <Zap className="w-24 h-24 text-yellow-400 absolute -top-12 -left-12 rotate-45" />
                <Zap className="w-24 h-24 text-yellow-400 absolute -bottom-12 -right-12 -rotate-45" />
            </motion.div>

            {/* Glow effect */}
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 -z-10" />
        </div>
    );
}

// Particle Background Component
function ParticleBackground() {
    const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 20 + 10
    }));

    return (
        <div className="absolute inset-0 overflow-hidden">
            {particles.map(particle => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-white/10"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />
            ))}
        </div>
    );
}
