import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function TechVennDiagram({ techStackA, techStackB, userA, userB }) {
    const [hoveredTech, setHoveredTech] = useState(null);

    // Deduplicate tech stacks to avoid duplicate keys
    const uniqueTechA = [...new Set(techStackA)];
    const uniqueTechB = [...new Set(techStackB)];

    const shared = uniqueTechA.filter(tech => uniqueTechB.includes(tech));
    const uniqueA = uniqueTechA.filter(tech => !uniqueTechB.includes(tech));
    const uniqueB = uniqueTechB.filter(tech => !uniqueTechA.includes(tech));

    const totalTech = new Set([...uniqueTechA, ...uniqueTechB]).size;
    const overlapPercentage = totalTech > 0 ? Math.round((shared.length / totalTech) * 100) : 0;

    const getOverlapLabel = (percentage) => {
        if (percentage >= 81) return "Identical DNA";
        if (percentage >= 61) return "Tech Twins";
        if (percentage >= 41) return "Similar Toolkit";
        if (percentage >= 21) return "Some Overlap";
        return "Different Worlds";
    };

    return (
        <div className="space-y-6 w-full">
            {/* Overlap percentage and label */}
            <div className="text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2"
                >
                    {overlapPercentage}%
                </motion.div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400">
                    {getOverlapLabel(overlapPercentage)}
                </div>
            </div>

            {/* SVG Venn Diagram */}
            <div className="flex justify-center py-6">
                <svg viewBox="0 0 400 180" className="w-full max-w-md h-auto">
                    {/* Fighter A Circle (Blue) */}
                    <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.12 }}
                        cx="140"
                        cy="90"
                        r="70"
                        fill="#3b82f6"
                    />

                    {/* Fighter B Circle (Purple) */}
                    <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.12 }}
                        transition={{ delay: 0.1 }}
                        cx="260"
                        cy="90"
                        r="70"
                        fill="#a855f7"
                    />

                    {/* Stroke Circles for Definition */}
                    <circle cx="140" cy="90" r="70" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.3" />
                    <circle cx="260" cy="90" r="70" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.3" />

                    {/* Labels */}
                    <text x="105" y="40" className="fill-blue-600 dark:fill-blue-400 font-semibold text-xs">{userA}</text>
                    <text x="295" y="40" textAnchor="end" className="fill-purple-600 dark:fill-purple-400 font-semibold text-xs">{userB}</text>

                    {/* Overlap Count */}
                    <text x="200" y="95" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400 font-bold text-sm">
                        {shared.length}
                    </text>
                </svg>
            </div>

            {/* Tech lists - Better aligned grid */}
            <div className="grid grid-cols-3 gap-4">
                {/* Only Fighter A */}
                <div className="space-y-2">
                    <div className="text-center font-semibold text-blue-600 dark:text-blue-400 text-sm">
                        Unique A
                    </div>
                    <div className="space-y-1.5">
                        {uniqueA.slice(0, 6).map((tech, index) => (
                            <div
                                key={`unique-a-${index}-${tech}`}
                                className="bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 px-2 py-1.5 rounded text-xs font-medium text-center border border-blue-100 dark:border-blue-900/30 truncate"
                                title={tech}
                            >
                                {tech}
                            </div>
                        ))}
                        {uniqueA.length === 0 && (
                            <div className="text-gray-400 text-xs text-center py-2">None</div>
                        )}
                    </div>
                </div>

                {/* Shared */}
                <div className="space-y-2 border-l border-r border-gray-200 dark:border-gray-700 px-2">
                    <div className="text-center font-semibold text-gray-600 dark:text-gray-400 text-sm">
                        Shared
                    </div>
                    <div className="space-y-1.5">
                        {shared.slice(0, 6).map((tech, index) => (
                            <div
                                key={`shared-${index}-${tech}`}
                                className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1.5 rounded text-xs font-medium text-center border border-gray-200 dark:border-gray-700 truncate"
                                title={tech}
                            >
                                {tech}
                            </div>
                        ))}
                        {shared.length === 0 && (
                            <div className="text-gray-400 text-xs text-center py-2">None</div>
                        )}
                    </div>
                </div>

                {/* Only Fighter B */}
                <div className="space-y-2">
                    <div className="text-center font-semibold text-purple-600 dark:text-purple-400 text-sm">
                        Unique B
                    </div>
                    <div className="space-y-1.5">
                        {uniqueB.slice(0, 6).map((tech, index) => (
                            <div
                                key={`unique-b-${index}-${tech}`}
                                className="bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300 px-2 py-1.5 rounded text-xs font-medium text-center border border-purple-100 dark:border-purple-900/30 truncate"
                                title={tech}
                            >
                                {tech}
                            </div>
                        ))}
                        {uniqueB.length === 0 && (
                            <div className="text-gray-400 text-xs text-center py-2">None</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
