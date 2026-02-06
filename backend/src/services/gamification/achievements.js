/**
 * Achievement Badge System
 * Auto-award badges based on user metrics
 */

const ACHIEVEMENTS = {
    PROJECT_PIONEER: {
        id: 'project_pioneer',
        name: 'Project Pioneer',
        description: 'Created 10+ repositories',
        icon: '🚀',
        tier: 'bronze',
        check: (data) => data.repositories?.length >= 10
    },
    STAR_COLLECTOR: {
        id: 'star_collector',
        name: 'Star Collector',
        description: 'Earned 100+ stars',
        icon: '⭐',
        tier: 'silver',
        check: (data) => {
            const totalStars = data.repositories?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0;
            return totalStars >= 100;
        }
    },
    CONSISTENCY_KING: {
        id: 'consistency_king',
        name: 'Consistency King',
        description: '30+ day commit streak',
        icon: '👑',
        tier: 'gold',
        check: (data) => data.contributions?.longestStreak >= 30
    },
    COMMIT_MACHINE: {
        id: 'commit_machine',
        name: 'Commit Machine',
        description: '1000+ total commits',
        icon: '⚡',
        tier: 'silver',
        check: (data) => data.contributions?.totalCommits >= 1000
    },
    POLYGLOT: {
        id: 'polyglot',
        name: 'Polyglot',
        description: 'Used 5+ programming languages',
        icon: '🌐',
        tier: 'bronze',
        check: (data) => {
            const languages = data.repositories?.map(r => r.language).filter(Boolean) || [];
            const uniqueLanguages = [...new Set(languages)];
            return uniqueLanguages.length >= 5;
        }
    },
    DOCUMENTATION_MASTER: {
        id: 'documentation_master',
        name: 'Documentation Master',
        description: '80%+ repos have README',
        icon: '📚',
        tier: 'gold',
        check: (data) => {
            const repos = data.repositories || [];
            if (repos.length === 0) return false;
            const withReadme = repos.filter(r => r.hasReadme).length;
            return (withReadme / repos.length) >= 0.8;
        }
    },
    OPEN_SOURCE_HERO: {
        id: 'open_source_hero',
        name: 'Open Source Hero',
        description: '20+ public repositories',
        icon: '🦸',
        tier: 'silver',
        check: (data) => data.repositories?.length >= 20
    },
    STREAK_WARRIOR: {
        id: 'streak_warrior',
        name: 'Streak Warrior',
        description: '100+ day commit streak',
        icon: '🔥',
        tier: 'legendary',
        check: (data) => data.contributions?.longestStreak >= 100
    },
    IMPACT_MAKER: {
        id: 'impact_maker',
        name: 'Impact Maker',
        description: '500+ stars earned',
        icon: '💫',
        tier: 'legendary',
        check: (data) => {
            const totalStars = data.repositories?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0;
            return totalStars >= 500;
        }
    },
    CODE_VETERAN: {
        id: 'code_veteran',
        name: 'Code Veteran',
        description: '5000+ commits',
        icon: '🎖️',
        tier: 'legendary',
        check: (data) => data.contributions?.totalCommits >= 5000
    },
    EARLY_ADOPTER: {
        id: 'early_adopter',
        name: 'Early Adopter',
        description: 'GitHub account 5+ years old',
        icon: '🌟',
        tier: 'gold',
        check: (data) => {
            if (!data.profile?.createdAt) return false;
            const accountAge = (Date.now() - new Date(data.profile.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365);
            return accountAge >= 5;
        }
    },
    NIGHT_OWL: {
        id: 'night_owl',
        name: 'Night Owl',
        description: '50%+ commits after 8 PM',
        icon: '🦉',
        tier: 'bronze',
        check: (data) => {
            // This would require commit timestamp data
            // For now, return false as we don't have this data
            return false;
        }
    }
};

/**
 * Award achievements to a user based on their data
 * @param {Object} userData - User analysis data
 * @returns {Array} - Array of unlocked achievements
 */
function awardAchievements(userData) {
    if (!userData) return [];

    const unlocked = [];

    Object.values(ACHIEVEMENTS).forEach(achievement => {
        try {
            if (achievement.check(userData)) {
                unlocked.push({
                    id: achievement.id,
                    name: achievement.name,
                    description: achievement.description,
                    icon: achievement.icon,
                    tier: achievement.tier
                });
            }
        } catch (error) {
            console.error(`Error checking achievement ${achievement.id}:`, error);
        }
    });

    // Sort by tier (legendary > gold > silver > bronze)
    const tierOrder = { legendary: 0, gold: 1, silver: 2, bronze: 3 };
    unlocked.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);

    return unlocked;
}

/**
 * Get achievement statistics
 * @param {Array} achievements - Unlocked achievements
 * @returns {Object} - Achievement stats
 */
function getAchievementStats(achievements) {
    const stats = {
        total: achievements.length,
        byTier: {
            legendary: 0,
            gold: 0,
            silver: 0,
            bronze: 0
        },
        percentage: 0
    };

    achievements.forEach(achievement => {
        stats.byTier[achievement.tier]++;
    });

    stats.percentage = Math.round((achievements.length / Object.keys(ACHIEVEMENTS).length) * 100);

    return stats;
}

module.exports = {
    ACHIEVEMENTS,
    awardAchievements,
    getAchievementStats
};
