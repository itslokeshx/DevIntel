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
        if (percentage >= 81) return "Identical DNA";
        if (percentage >= 61) return "Tech Twins";
        if (percentage >= 41) return "Similar Toolkit";
        if (percentage >= 21) return "Some Overlap";
        return "Different Worlds";
    };

    return (
        <div className="space-y-6 w-full h-full flex flex-col">
            {/* Overlap percentage and label */}
            <div className="text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-1"
                >
                    {overlapPercentage}%
                </motion.div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700/50 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400">
                    {getOverlapLabel(overlapPercentage)}
                </div>
            </div>

            {/* SVG Venn Diagram */}
            <div className="flex justify-center flex-1 items-center py-4">
                <svg viewBox="0 0 400 200" className="w-full max-w-lg h-auto">
                    {/* Fighter A Circle (Blue) */}
                    <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.15 }} // Reduced opacity for cleaner look
                        cx="140"
                        cy="100"
                        r="80"
                        fill="#3b82f6"
                        className="cursor-pointer transition-colors"
                    />

                    {/* Fighter B Circle (Purple) */}
                    <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.15 }}
                        transition={{ delay: 0.2 }}
                        cx="260"
                        cy="100"
                        r="80"
                        fill="#a855f7"
                        className="cursor-pointer transition-colors"
                    />

                    {/* Stroke Circles for Definition */}
                    <circle cx="140" cy="100" r="80" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.4" />
                    <circle cx="260" cy="100" r="80" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.4" />

                    {/* Labels */}
                    <text x="100" y="50" className="fill-blue-600 dark:fill-blue-400 font-semibold text-xs uppercase tracking-wide">{userA}</text>
                    <text x="300" y="50" textAnchor="end" className="fill-purple-600 dark:fill-purple-400 font-semibold text-xs uppercase tracking-wide">{userB}</text>
                </svg>
            </div>

            {/* Tech lists */}
            <div className="grid grid-cols-3 gap-2 text-xs">
                {/* Only Fighter A */}
                <div className="text-center">
                    <div className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Unique to A</div>
                    <div className="flex flex-wrap justify-center gap-1">
                        {uniqueA.slice(0, 5).map(tech => (
                            <span key={tech} className="bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/30">
                                {tech}
                            </span>
                        ))}
                        {uniqueA.length === 0 && <span className="text-gray-400">-</span>}
                    </div>
                </div>

                {/* Shared */}
                <div className="text-center px-2 border-l border-r border-gray-100 dark:border-gray-800">
                    <div className="font-semibold text-gray-600 dark:text-gray-400 mb-2">Shared</div>
                    <div className="flex flex-wrap justify-center gap-1">
                        {shared.slice(0, 5).map(tech => (
                            <span key={tech} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                                {tech}
                            </span>
                        ))}
                        {shared.length === 0 && <span className="text-gray-400">-</span>}
                    </div>
                </div>

                {/* Only Fighter B */}
                <div className="text-center">
                    <div className="font-semibold text-purple-600 dark:text-purple-400 mb-2">Unique to B</div>
                    <div className="flex flex-wrap justify-center gap-1">
                        {uniqueB.slice(0, 5).map(tech => (
                            <span key={tech} className="bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded border border-purple-100 dark:border-purple-900/30">
                                {tech}
                            </span>
                        ))}
                        {uniqueB.length === 0 && <span className="text-gray-400">-</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
