import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function TechVennDiagram({ techStackA, techStackB, userA, userB }) {
    const [hoveredTech, setHoveredTech] = useState(null);

    const shared = techStackA.filter(tech => techStackB.includes(tech));
    const uniqueA = techStackA.filter(tech => !techStackB.includes(tech));
    const uniqueB = techStackB.filter(tech => !techStackA.includes(tech));

    const totalTech = new Set([...techStackA, ...techStackB]).size;
    const overlapPercentage = totalTech > 0 ? Math.round((shared.length / totalTech) * 100) : 0;

    const getOverlapLabel = (percentage) => {
        if (percentage >= 81) return "Identical DNA 🧬";
        if (percentage >= 61) return "Tech Stack Twins 👯";
        if (percentage >= 41) return "Similar Toolkits 🔧";
        if (percentage >= 21) return "Some Common Ground 🤝";
        return "Completely Different Worlds 🌍";
    };

    return (
        <div className="space-y-6">
            {/* Overlap percentage and label */}
            <div className="text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-2"
                >
                    {overlapPercentage}%
                </motion.div>
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    {getOverlapLabel(overlapPercentage)}
                </p>
            </div>

            {/* SVG Venn Diagram */}
            <div className="flex justify-center">
                <svg viewBox="0 0 400 250" className="w-full max-w-2xl h-auto">
                    {/* Fighter A Circle (Blue) */}
                    <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.3 }}
                        transition={{ duration: 0.5 }}
                        cx="140"
                        cy="125"
                        r="80"
                        fill="#3b82f6"
                        className="cursor-pointer hover:opacity-50 transition-opacity"
                    />

                    {/* Fighter B Circle (Purple) */}
                    <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.3 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        cx="260"
                        cy="125"
                        r="80"
                        fill="#a855f7"
                        className="cursor-pointer hover:opacity-50 transition-opacity"
                    />

                    {/* Labels */}
                    <text x="100" y="50" className="fill-blue-600 dark:fill-blue-400 font-bold text-sm">
                        {userA}
                    </text>
                    <text x="240" y="50" className="fill-purple-600 dark:fill-purple-400 font-bold text-sm">
                        {userB}
                    </text>

                    {/* Overlap label */}
                    <text x="200" y="125" textAnchor="middle" className="fill-yellow-600 dark:fill-yellow-400 font-bold text-xs">
                        Shared
                    </text>
                </svg>
            </div>

            {/* Tech lists */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Only Fighter A */}
                <div className="text-center">
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-3 text-base">
                        Only {userA}
                    </h4>
                    <div className="flex flex-wrap gap-2 justify-center min-h-[100px] bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
                        {uniqueA.length > 0 ? (
                            uniqueA.slice(0, 10).map(tech => (
                                <motion.span
                                    key={tech}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.1 }}
                                    onHoverStart={() => setHoveredTech(tech)}
                                    onHoverEnd={() => setHoveredTech(null)}
                                    className="bg-blue-500/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-md text-sm font-medium cursor-pointer transition-all"
                                >
                                    {tech}
                                </motion.span>
                            ))
                        ) : (
                            <span className="text-gray-400 text-sm">None</span>
                        )}
                    </div>
                </div>

                {/* Shared */}
                <div className="text-center border-l border-r border-gray-200 dark:border-gray-800 px-4">
                    <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-3 text-base">
                        Shared ({shared.length})
                    </h4>
                    <div className="flex flex-wrap gap-2 justify-center min-h-[100px] bg-yellow-50 dark:bg-yellow-900/10 rounded-lg p-4">
                        {shared.length > 0 ? (
                            shared.slice(0, 10).map(tech => (
                                <motion.span
                                    key={tech}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.1 }}
                                    onHoverStart={() => setHoveredTech(tech)}
                                    onHoverEnd={() => setHoveredTech(null)}
                                    className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-md text-sm font-bold cursor-pointer transition-all"
                                >
                                    {tech}
                                </motion.span>
                            ))
                        ) : (
                            <span className="text-gray-400 text-sm">None</span>
                        )}
                    </div>
                </div>

                {/* Only Fighter B */}
                <div className="text-center">
                    <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-3 text-base">
                        Only {userB}
                    </h4>
                    <div className="flex flex-wrap gap-2 justify-center min-h-[100px] bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4">
                        {uniqueB.length > 0 ? (
                            uniqueB.slice(0, 10).map(tech => (
                                <motion.span
                                    key={tech}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.1 }}
                                    onHoverStart={() => setHoveredTech(tech)}
                                    onHoverEnd={() => setHoveredTech(null)}
                                    className="bg-purple-500/20 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-md text-sm font-medium cursor-pointer transition-all"
                                >
                                    {tech}
                                </motion.span>
                            ))
                        ) : (
                            <span className="text-gray-400 text-sm">None</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Hovered tech info */}
            {hoveredTech && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-sm text-gray-600 dark:text-gray-400"
                >
                    Click to see repositories using <span className="font-semibold">{hoveredTech}</span>
                </motion.div>
            )}
        </div>
    );
}
