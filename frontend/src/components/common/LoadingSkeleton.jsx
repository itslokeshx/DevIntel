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
                        className="bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-default)] p-6"
                    >
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-[var(--bg-tertiary)] rounded w-3/4"></div>
                            <div className="h-3 bg-[var(--bg-tertiary)] rounded w-full"></div>
                            <div className="h-3 bg-[var(--bg-tertiary)] rounded w-5/6"></div>
                        </div>
                    </motion.div>
                ))}
            </>
        );
    }
    
    if (type === 'heatmap') {
        return (
            <div className="bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-default)] p-6 overflow-hidden">
                <div className="animate-pulse space-y-4">
                    <div className="h-5 bg-[var(--bg-tertiary)] rounded w-1/3"></div>
                    <div className="flex gap-[3px] overflow-x-auto pb-2">
                        {Array.from({ length: 52 }).map((_, idx) => (
                            <div key={idx} className="flex flex-col gap-[3px] flex-shrink-0">
                                {Array.from({ length: 7 }).map((_, dayIdx) => (
                                    <div
                                        key={dayIdx}
                                        className="w-[10px] h-[10px] sm:w-[13px] sm:h-[13px] bg-[var(--bg-tertiary)] rounded-[2px]"
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
            <div className="bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-default)] p-6 sm:p-10">
                <div className="animate-pulse flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[var(--bg-tertiary)] rounded-full flex-shrink-0"></div>
                    <div className="flex-1 space-y-3 w-full">
                        <div className="h-6 bg-[var(--bg-tertiary)] rounded w-1/2 mx-auto sm:mx-0"></div>
                        <div className="h-3.5 bg-[var(--bg-tertiary)] rounded w-1/3 mx-auto sm:mx-0"></div>
                        <div className="h-3.5 bg-[var(--bg-tertiary)] rounded w-2/3 mx-auto sm:mx-0"></div>
                    </div>
                </div>
            </div>
        );
    }
    
    return null;
}
