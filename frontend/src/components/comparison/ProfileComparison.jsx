import React from 'react';
import { ExternalLink, MapPin, Users, Trophy } from 'lucide-react';

export function ProfileComparison({ userA, userB }) {
    const ProfileCard = ({ user, isUserA }) => {
        const profile = user.profile;
        const colorClass = isUserA
            ? 'from-primary-50 to-white dark:from-primary-900/10 dark:to-dark-bg-secondary border-primary-100 dark:border-primary-800'
            : 'from-purple-50 to-white dark:from-purple-900/10 dark:to-dark-bg-secondary border-purple-100 dark:border-purple-800';

        const ringColor = isUserA ? 'ring-primary-100 dark:ring-primary-900' : 'ring-purple-100 dark:ring-purple-900';
        const textColor = isUserA ? 'text-primary-700 dark:text-primary-300' : 'text-purple-700 dark:text-purple-300';

        return (
            <div className={`relative p-6 rounded-xl border bg-gradient-to-b ${colorClass} text-center flex-1 flex flex-col shadow-sm transition-all duration-300 hover:shadow-md`}>
                <div className={`absolute top-0 left-0 w-full h-1 rounded-t-xl ${isUserA ? 'bg-primary-500' : 'bg-purple-500'}`} />

                <div className="relative inline-block mx-auto mb-4">
                    <div className={`absolute inset-0 rounded-full ring-4 ${ringColor} opacity-50`}></div>
                    <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className={`relative w-28 h-28 rounded-full border-4 ${isUserA ? 'border-primary-500' : 'border-purple-500'} shadow-md`}
                    />
                    <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm whitespace-nowrap z-10 ${isUserA ? 'bg-primary-600' : 'bg-purple-600'}`}>
                        {isUserA ? 'Player A' : 'Player B'}
                    </div>
                </div>

                <div className="mt-2 mb-1">
                    <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                        {profile.name}
                    </h3>
                    <a
                        href={`https://github.com/${profile.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm font-medium ${textColor} hover:underline flex items-center justify-center gap-1`}
                    >
                        @{profile.username}
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>

                <div className="space-y-2 text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6 min-h-[48px] flex flex-col justify-center">
                    {profile.location && (
                        <div className="flex items-center justify-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {profile.location}
                        </div>
                    )}
                    <div className="flex items-center justify-center gap-1">
                        <Users className="w-3 h-3" />
                        {profile.followers.toLocaleString()} followers
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                    <div className="p-3 bg-white/80 dark:bg-black/20 rounded-lg border border-light-border dark:border-dark-border backdrop-blur-sm">
                        <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1 uppercase tracking-wide">Global Rank</div>
                        <div className="font-bold flex items-center justify-center gap-1">
                            <Trophy className="w-3 h-3 text-yellow-500" />
                            Top {user.metrics.globalRank}%
                        </div>
                    </div>
                    <div className="p-3 bg-white/80 dark:bg-black/20 rounded-lg border border-light-border dark:border-dark-border backdrop-blur-sm">
                        <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1 uppercase tracking-wide">Identity</div>
                        <div className="font-bold text-sm truncate px-1" title={user.metrics.primaryTechIdentity}>
                            {user.metrics.primaryTechIdentity}
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
                    <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-500 text-sm">VS</span>
                </div>
            </div>

            <div className="flex-1 flex">
                <ProfileCard user={userB} isUserA={false} />
            </div>
        </div>
    );
}
