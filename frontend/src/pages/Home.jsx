import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, BarChart3, Dna, Rocket } from 'lucide-react';

export function Home() {
    const navigate = useNavigate();
    const [githubUsername, setGithubUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!githubUsername.trim()) {
            setError('GitHub username is required');
            return;
        }

        setError('');
        setLoading(true);

        try {
            navigate(`/github/${githubUsername.trim()}`);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleCompare = () => {
        navigate('/compare');
    };

    const exampleUsers = ['torvalds', 'gvanrossum', 'gaearon', 'tj'];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
            
            {/* Hero Section */}
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center space-y-8 mb-16"
                >
                    <h1 className="text-7xl font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
                        ✨ DevIntel
                    </h1>
                    <p className="text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Decode Your Developer DNA
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-2xl mx-auto mb-8"
                >
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-6 w-6 text-gray-400 animate-pulse" />
                        </div>
                        <input
                            type="text"
                            value={githubUsername}
                            onChange={(e) => setGithubUsername(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                            placeholder="Enter GitHub username..."
                            className="w-full h-16 pl-12 pr-32 text-lg bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !githubUsername.trim()}
                            className="absolute inset-y-0 right-0 pr-2 flex items-center"
                        >
                            <div className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                {loading ? 'Analyzing...' : 'Analyze'}
                                <ArrowRight className="h-5 w-5" />
                            </div>
                        </button>
                    </div>
                    {error && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
                    )}
                    <p className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                        or try: {exampleUsers.map((user, i) => (
                            <React.Fragment key={user}>
                                <button
                                    onClick={() => {
                                        setGithubUsername(user);
                                        setTimeout(() => handleAnalyze(), 100);
                                    }}
                                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    {user}
                                </button>
                                {i < exampleUsers.length - 1 && ' · '}
                            </React.Fragment>
                        ))}
                    </p>
                </motion.div>

                {/* Three Pillars */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20"
                >
                    <PillarCard
                        icon={<BarChart3 className="h-8 w-8" />}
                        title="Past"
                        subtitle="Your Code Timeline"
                        description="See your evolution. Commits, stars, and contribution patterns mapped across years."
                    />
                    <PillarCard
                        icon={<Dna className="h-8 w-8" />}
                        title="Present"
                        subtitle="Developer Identity"
                        description="AI analyzes your work to identify: Are you a Builder? Architect? Explorer?"
                    />
                    <PillarCard
                        icon={<Rocket className="h-8 w-8" />}
                        title="Potential"
                        subtitle="Growth Vectors"
                        description="Personalized roadmap based on your trajectory and industry trends."
                    />
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-center"
                >
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                        Scroll for live examples ↓
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

function PillarCard({ icon, title, subtitle, description }) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-lg transition-all"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                    {icon}
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
                </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}
