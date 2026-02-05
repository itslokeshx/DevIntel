import React from 'react';

/**
 * Circular progress ring with smooth animations
 */
export function ProgressRing({
    progress = 0,
    size = 120,
    strokeWidth = 8,
    color = '#3B82F6',
    backgroundColor = '#E5E7EB',
    showPercentage = true,
    children
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg
                width={size}
                height={size}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="dark:stroke-gray-700"
                />

                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                    style={{
                        filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.4))'
                    }}
                />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center">
                {children || (showPercentage && (
                    <span className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                        {Math.round(progress)}%
                    </span>
                ))}
            </div>
        </div>
    );
}
