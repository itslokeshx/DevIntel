import React from 'react';

/**
 * Grid of achievement badges with unlock animations
 */
export function AchievementGrid({ achievements = [] }) {
    const getRarityColor = (rarity) => {
        const colors = {
            'legendary': 'from-yellow-400 to-orange-500',
            'epic': 'from-purple-500 to-pink-500',
            'rare': 'from-blue-500 to-cyan-500',
            'uncommon': 'from-green-500 to-emerald-500',
            'common': 'from-gray-400 to-gray-500'
        };
        return colors[rarity] || colors['common'];
    };

    const getRarityGlow = (rarity) => {
        const glows = {
            'legendary': 'shadow-[0_0_20px_rgba(251,191,36,0.5)]',
            'epic': 'shadow-[0_0_15px_rgba(168,85,247,0.4)]',
            'rare': 'shadow-[0_0_12px_rgba(59,130,246,0.3)]',
            'uncommon': 'shadow-[0_0_10px_rgba(16,185,129,0.3)]',
            'common': ''
        };
        return glows[rarity] || '';
    };

    if (achievements.length === 0) {
        return (
            <div className="text-center py-8 text-text-tertiary-light dark:text-text-tertiary-dark">
                <p>No achievements earned yet. Keep coding to unlock badges!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {achievements.map((achievement, index) => (
                <div
                    key={achievement.id}
                    className="group relative"
                    style={{
                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                    }}
                >
                    <div className={`
                        relative bg-white dark:bg-gray-800 rounded-xl p-4
                        border-2 border-transparent
                        bg-gradient-to-br ${getRarityColor(achievement.rarity)}
                        ${getRarityGlow(achievement.rarity)}
                        transition-all duration-300
                        hover:scale-105 hover:-translate-y-1
                        cursor-pointer
                    `}>
                        {/* Icon */}
                        <div className="text-4xl mb-2 text-center">
                            {achievement.icon}
                        </div>

                        {/* Name */}
                        <div className="text-xs font-bold text-center text-white mb-1">
                            {achievement.name}
                        </div>

                        {/* Rarity badge */}
                        <div className="text-[10px] text-center text-white/80 uppercase tracking-wide">
                            {achievement.rarity}
                        </div>
                    </div>

                    {/* Tooltip */}
                    <div className="
                        absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
                        bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg py-2 px-3
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200
                        pointer-events-none whitespace-nowrap z-10
                        shadow-lg
                    ">
                        {achievement.description}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                            <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Add fadeInUp animation to global styles or use Tailwind config
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
if (typeof document !== 'undefined') {
    document.head.appendChild(style);
}
