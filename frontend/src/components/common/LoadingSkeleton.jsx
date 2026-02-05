import React from 'react';
import { motion } from 'framer-motion';

export function LoadingSkeleton({ type = 'card', count = 1 }) {
    const skeletons = Array.from({ length: count });
    
    if (type === 'card') {
        return (
            <>
                {skeletons.map((_, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8"
                    >
                        <div className="animate-pulse space-y-4">
                            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
                        </div>
                    </motion.div>
                ))}
            </>
        );
    }
    
    if (type === 'heatmap') {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                    <div className="flex gap-1">
                        {Array.from({ length: 52 }).map((_, idx) => (
                            <div key={idx} className="flex flex-col gap-1">
                                {Array.from({ length: 7 }).map((_, dayIdx) => (
                                    <div
                                        key={dayIdx}
                                        className="w-3 h-3 bg-gray-200 dark:bg-gray-800 rounded-sm"
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
    if (type === 'profile') {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
                <div className="animate-pulse flex items-center gap-6">
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                    <div className="flex-1 space-y-3">
                        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                    </div>
                </div>
            </div>
        );
    }
    
    return null;
}

