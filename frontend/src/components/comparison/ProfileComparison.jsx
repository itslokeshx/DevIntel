import React from 'react';
import { ExternalLink, MapPin, Users } from 'lucide-react';

export function ProfileComparison({ userA, userB }) {
    const ProfileCard = ({ user, isUserA }) => {
        const profile = user.profile;
        const colorClass = isUserA
            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/10 border-primary-100 dark:border-primary-800'
            : 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800';

        return (
            <div className={`p-6 rounded-xl border ${colorClass} text-center flex-1`}>
                <div className="relative inline-block mb-4">
                    <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className={`w-24 h-24 rounded-full border-4 ${isUserA ? 'border-primary-200' : 'border-purple-200'}`}
                    />
                    <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${isUserA ? 'bg-primary-500' : 'bg-purple-500'}`}>
                        {isUserA ? 'Player A' : 'Player B'}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary mb-1">
                    {profile.name}
                </h3>
                <a
                    href={`https://github.com/${profile.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:underline flex items-center justify-center gap-1 mb-4"
                >
                    @{profile.username}
                    <ExternalLink className="w-3 h-3" />
                </a>

                <div className="space-y-2 text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6">
                    {profile.location && (
                        <div className="flex items-center justify-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {profile.location}
                        </div>
                    )}
                    <div className="flex items-center justify-center gap-1">
                        <Users className="w-3 h-3" />
                        {profile.followers} followers
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-white dark:bg-dark-bg-tertiary rounded-lg border border-light-border dark:border-dark-border">
                        <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">Global Rank</div>
                        <div className="font-bold">Top {user.metrics.globalRank}%</div>
                    </div>
                    <div className="p-2 bg-white dark:bg-dark-bg-tertiary rounded-lg border border-light-border dark:border-dark-border">
                        <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">Identity</div>
                        <div className="font-bold text-xs truncate" title={user.metrics.primaryTechIdentity}>
                            {user.metrics.primaryTechIdentity}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 mb-8">
            <ProfileCard user={userA} isUserA={true} />

            <div className="hidden md:flex flex-col items-center justify-center">
                <div className="w-px h-full bg-light-border dark:bg-dark-border absolute" />
                <div className="z-10 bg-light-bg-tertiary dark:bg-dark-bg-tertiary p-2 rounded-full border border-light-border dark:border-dark-border font-bold text-light-text-tertiary dark:text-dark-text-tertiary">
                    VS
                </div>
            </div>

            <ProfileCard user={userB} isUserA={false} />
        </div>
    );
}
