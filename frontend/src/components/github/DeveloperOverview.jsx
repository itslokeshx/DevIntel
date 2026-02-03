import React from 'react';
import { Flame, TrendingUp, Star, GitFork, FolderGit2, Code2, Calendar, Trophy } from 'lucide-react';
import StatsCard from '../common/StatsCard';
import AchievementBadge from '../common/AchievementBadge';
import { Card } from '../common/Card';

export default function DeveloperOverview({ data }) {
    // Null checks
    if (!data || !data.profile || !data.metrics || !data.contributions) {
        return null;
    }

    const { profile, metrics, contributions, aiInsights } = data;

    // Calculate streak progress to next milestone (every 10 days)
    const currentStreak = contributions.currentStreak || 0;
    const nextMilestone = Math.ceil(currentStreak / 10) * 10 || 10;
    const streakProgress = (currentStreak / nextMilestone) * 100;

    // Calculate commit milestone badge
    const getCommitBadge = (commits) => {
        if (commits >= 10000) return '🏆 10k+';
        if (commits >= 5000) return '🏆 5k+';
        if (commits >= 1000) return '🏆 1k+';
        if (commits >= 500) return '🎯 500+';
        return null;
    };

    // Count active repos
    const activeRepos = data.repositories?.filter(r => r.maturityStage === 'active').length || 0;
    const totalRepos = data.repositories?.length || 0;

    // Calculate coding days this year
    const codingDaysThisYear = contributions.commitsByMonth?.reduce((sum, month) => {
        const year = new Date().getFullYear();
        if (month.month.startsWith(year.toString())) {
            return sum + month.count;
        }
        return sum;
    }, 0) || 0;

    // Get top languages
    const topLanguages = metrics.skills?.slice(0, 3) || [];

    // Generate achievements
    const achievements = [];

    if (currentStreak >= 30) {
        achievements.push({ icon: '🔥', title: 'Streak Master', description: `${currentStreak}-day streak active!` });
    }
    if (totalRepos >= 20) {
        achievements.push({ icon: '🚀', title: 'Prolific Creator', description: `${totalRepos} repositories created` });
    }
    if (metrics.impactScore >= 70) {
        achievements.push({ icon: '⭐', title: 'Community Favorite', description: 'High community impact' });
    }
    if (metrics.skills?.filter(s => s.level === 'expert').length >= 3) {
        achievements.push({ icon: '🌐', title: 'Polyglot', description: 'Expert in multiple languages' });
    }
    const excellentDocs = data.repositories?.filter(r => r.documentationQuality === 'excellent').length || 0;
    if (excellentDocs >= 5) {
        achievements.push({ icon: '📚', title: 'Documentation Pro', description: `${excellentDocs} repos with excellent docs` });
    }
    if (metrics.activityPattern === 'comeback') {
        achievements.push({ icon: '💪', title: 'Comeback Kid', description: 'Returned after a break' });
    }

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <Card>
                <div className="flex items-start gap-6">
                    <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className="w-24 h-24 rounded-full border-4 border-primary-500 dark:border-primary-400"
                    />
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
                            {profile.name || profile.login}
                        </h1>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-3">
                            {profile.bio || `🌐 ${metrics.primaryTechIdentity} · Building amazing projects`}
                        </p>
                        {profile.location && (
                            <p className="text-sm text-text-tertiary-light dark:text-text-tertiary-dark">
                                📍 {profile.location}
                            </p>
                        )}
                    </div>
                </div>
            </Card>

            {/* Achievement Dashboard */}
            <div>
                <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
                    📊 Achievement Dashboard
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Current Streak */}
                    <StatsCard
                        icon={<Flame />}
                        value={currentStreak}
                        label="Current Streak"
                        sublabel={`Next milestone: ${nextMilestone} days`}
                        progress={streakProgress}
                        color="fire"
                    />

                    {/* Total Commits */}
                    <StatsCard
                        icon={<TrendingUp />}
                        value={contributions.totalCommits?.toLocaleString() || '0'}
                        label="Total Commits"
                        sublabel="All-time contributions"
                        badge={getCommitBadge(contributions.totalCommits)}
                        color="success"
                    />

                    {/* Total Stars */}
                    <StatsCard
                        icon={<Star />}
                        value={data.repositories?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0}
                        label="Stars Earned"
                        sublabel="Community appreciation"
                        color="star"
                    />

                    {/* Active Projects */}
                    <StatsCard
                        icon={<FolderGit2 />}
                        value={`${activeRepos}/${totalRepos}`}
                        label="Active Projects"
                        sublabel={`${totalRepos - activeRepos} archived`}
                        progress={(activeRepos / totalRepos) * 100}
                        color="primary"
                    />

                    {/* Longest Streak */}
                    <StatsCard
                        icon={<Trophy />}
                        value={contributions.longestStreak || 0}
                        label="Longest Streak"
                        sublabel="Personal record"
                        color="warning"
                    />

                    {/* Coding Days */}
                    <StatsCard
                        icon={<Calendar />}
                        value={codingDaysThisYear}
                        label="Commits This Year"
                        sublabel={`Busiest: ${contributions.busiestMonth || 'N/A'}`}
                        color="primary"
                    />
                </div>
            </div>

            {/* AI Insights */}
            {aiInsights && (
                <Card>
                    <div className="flex items-start gap-3 mb-4">
                        <div className="text-2xl">💡</div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
                                AI Insights
                            </h3>
                            <p className="text-text-secondary-light dark:text-text-secondary-dark italic">
                                "{aiInsights.oneLineInsight}"
                            </p>
                        </div>
                    </div>

                    {aiInsights.activityNarrative && (
                        <p className="text-sm text-text-tertiary-light dark:text-text-tertiary-dark mb-4">
                            {aiInsights.activityNarrative}
                        </p>
                    )}

                    {aiInsights.growthActions && aiInsights.growthActions.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                                🎯 Recommended Next Steps:
                            </h4>
                            <ul className="space-y-2">
                                {aiInsights.growthActions.map((action, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                                        <span className="text-primary-500 dark:text-primary-400 font-bold">•</span>
                                        <span>{action}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Card>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
                        🏆 Achievements Unlocked
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {achievements.map((achievement, index) => (
                            <AchievementBadge
                                key={index}
                                icon={achievement.icon}
                                title={achievement.title}
                                description={achievement.description}
                                unlocked={true}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Tech Stack */}
            {topLanguages.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
                        💻 Top Tech Stack
                    </h2>
                    <Card>
                        <div className="space-y-4">
                            {topLanguages.map((skill, index) => {
                                const proficiencyPercent = skill.level === 'expert' ? 90 : skill.level === 'advanced' ? 70 : 50;
                                const projectCount = data.repositories?.filter(r => r.language === skill.name).length || 0;

                                return (
                                    <div key={index}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Code2 className="w-5 h-5 text-primary-500 dark:text-primary-400" />
                                                <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                                                    {skill.name}
                                                </span>
                                                <span className="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                                                    {skill.level}
                                                </span>
                                            </div>
                                            <span className="text-sm text-text-tertiary-light dark:text-text-tertiary-dark">
                                                {projectCount} {projectCount === 1 ? 'project' : 'projects'}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-1000"
                                                style={{ width: `${proficiencyPercent}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
