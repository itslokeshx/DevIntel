import React from 'react';
import { ExternalLink, MapPin, Users, Trophy } from 'lucide-react';

export function ProfileComparison({ userA, userB }) {
    const ProfileCard = ({ user, isUserA }) => {
        const profile = user.profile;
        const metrics = user.metrics;

        // Distinct themes for User A vs User B
        // Distinct themes for User A vs User B
        // Distinct themes for User A vs User B
        const theme = isUserA ? {
            bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100/30 dark:from-indigo-900/20 dark:to-indigo-900/5',
            border: 'border-indigo-100 dark:border-indigo-800',
            accent: 'bg-indigo-500',
            accentText: 'text-indigo-700 dark:text-indigo-300',
            ring: 'ring-indigo-100 dark:ring-indigo-900',
            shadow: 'shadow-indigo-500/10',
            label: 'Player A'
        } : {
            bg: 'bg-gradient-to-br from-violet-50 to-violet-100/30 dark:from-violet-900/20 dark:to-violet-900/5',
            border: 'border-violet-100 dark:border-violet-800',
            accent: 'bg-violet-500',
            accentText: 'text-violet-700 dark:text-violet-300',
            ring: 'ring-violet-100 dark:ring-violet-900',
            shadow: 'shadow-violet-500/10',
            label: 'Player B'
        };

        return (
            <div className={`relative p-6 rounded-2xl border ${theme.border} ${theme.bg} text-center flex-1 flex flex-col shadow-lg ${theme.shadow} transition-all duration-300 hover:scale-[1.02]`}>

                {/* Top Status Badge */}
                <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-white/50 dark:bg-black/20 border ${theme.border} uppercase tracking-wider backdrop-blur-sm`}>
                        {metrics.activityPattern || 'Analyzing...'}
                    </span>
                </div>

                <div className="relative inline-block mx-auto mb-6 mt-2">
                    <div className={`absolute inset-0 rounded-full ring-8 ${theme.ring} opacity-20 animate-pulse`}></div>
                    <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className={`relative w-32 h-32 rounded-full border-[6px] ${isUserA ? 'border-primary-500' : 'border-purple-500'} shadow-xl bg-white dark:bg-dark-bg-secondary object-cover`}
                    />
                    <div className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-black text-white shadow-lg whitespace-nowrap z-10 ${theme.accent} tracking-widest uppercase`}>
                        {theme.label}
                    </div>
                </div>

                <div className="mt-6 mb-2">
                    <h3 className="text-2xl font-black text-light-text-primary dark:text-dark-text-primary mb-1">
                        {profile.name}
                    </h3>
                    <a
                        href={`https://github.com/${profile.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm font-semibold ${theme.accentText} hover:underline flex items-center justify-center gap-1.5`}
                    >
                        @{profile.username}
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>

                {/* Location & Followers */}
                <div className="flex items-center justify-center gap-4 text-sm text-light-text-secondary dark:text-dark-text-secondary mb-8">
                    {profile.location && (
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 opacity-70" />
                            {profile.location}
                        </div>
                    )}
                    <div className="w-1 h-1 rounded-full bg-light-border dark:bg-dark-border" />
                    <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 opacity-70" />
                        <span className="font-medium">{profile.followers.toLocaleString()}</span>
                    </div>
                </div>

                {/* Key Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mt-auto">
                    <div className="col-span-2 p-3 bg-white/60 dark:bg-white/5 rounded-xl border border-light-border dark:border-dark-border backdrop-blur-sm group hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                        <div className="text-[10px] font-bold text-light-text-tertiary dark:text-dark-text-tertiary mb-1 uppercase tracking-widest">Dev Score</div>
                        <div className="font-black text-2xl flex items-center justify-center gap-1">
                            <span className={isUserA ? 'text-primary-600 dark:text-primary-400' : 'text-purple-600 dark:text-purple-400'}>
                                {user.metrics.devScore}
                            </span>
                            <span className="text-xs text-gray-400 font-medium self-end mb-1.5">/100</span>
                        </div>
                    </div>

                    <div className="p-3 bg-white/60 dark:bg-white/5 rounded-xl border border-light-border dark:border-dark-border backdrop-blur-sm group hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                        <div className="text-[10px] font-bold text-light-text-tertiary dark:text-dark-text-tertiary mb-1 uppercase tracking-widest">Global Rank</div>
                        <div className="font-black text-lg flex items-center justify-center gap-1.5">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            Top {user.metrics.globalRank}%
                        </div>
                    </div>
                    <div className="p-3 bg-white/60 dark:bg-white/5 rounded-xl border border-light-border dark:border-dark-border backdrop-blur-sm group hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                        <div className="text-[10px] font-bold text-light-text-tertiary dark:text-dark-text-tertiary mb-1 uppercase tracking-widest">Identity</div>
                        <div className="font-bold text-sm truncate px-1 text-light-text-primary dark:text-dark-text-primary" title={metrics.primaryTechIdentity}>
                            {metrics.primaryTechIdentity}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="relative flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex-1 flex">
                <ProfileCard user={userA} isUserA={true} />
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-white dark:bg-dark-bg-secondary border-4 border-gray-100 dark:border-gray-800 shadow-xl flex items-center justify-center">
                    <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500 text-sm">VS</span>
                </div>
            </div>

            <div className="flex-1 flex">
                <ProfileCard user={userB} isUserA={false} />
            </div>
        </div>
    );
}
