import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Trophy, ArrowUp } from 'lucide-react';

export function RacingBars({ label, valueA, valueB, userA, userB, icon: Icon }) {
    const maxValue = Math.max(valueA, valueB, 1);
    const percentageA = (valueA / maxValue) * 100;
    const percentageB = (valueB / maxValue) * 100;

    const winner = valueA > valueB ? 'A' : valueB > valueA ? 'B' : 'tie';

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
                {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
            </div>

            <div className="relative space-y-2">
                {/* Bar A */}
                <div className="group">
                    <div className="flex justify-between text-xs mb-1">
                        <span className={`font-medium ${winner === 'A' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>{userA}</span>
                        <span className="font-mono font-medium text-gray-700 dark:text-gray-300">
                            <CountUp end={valueA} separator="," duration={1} />
                        </span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentageA}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`h-full rounded-full ${winner === 'A' ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-400 dark:bg-gray-600'}`}
                        />
                    </div>
                </div>

                {/* Bar B */}
                <div className="group">
                    <div className="flex justify-between text-xs mb-1">
                        <span className={`font-medium ${winner === 'B' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'}`}>{userB}</span>
                        <span className="font-mono font-medium text-gray-700 dark:text-gray-300">
                            <CountUp end={valueB} separator="," duration={1} />
                        </span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentageB}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`h-full rounded-full ${winner === 'B' ? 'bg-purple-600 dark:bg-purple-500' : 'bg-gray-400 dark:bg-gray-600'}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
