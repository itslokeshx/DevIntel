/**
 * Gamification Engine for DevIntel
 * Calculates levels, XP, achievements, and badges
 */

/**
 * Calculate developer level and XP
 */
function calculateLevel(data) {
    const { repositories, contributions, metrics } = data;

    // XP Sources
    const xp = {
        commits: contributions.totalCommits * 10,
        repos: repositories.length * 100,
        activeRepos: repositories.filter(r => r.maturityStage === 'active').length * 150,
        stars: repositories.reduce((sum, r) => sum + (r.stars || 0), 0) * 50,
        consistency: metrics.consistencyScore * 20,
        impact: metrics.impactScore * 25,
        documentation: getDocumentationXP(metrics.documentationHabits),
        streak: contributions.longestStreak * 15,
        languages: metrics.skills.length * 80
    };

    const totalXP = Object.values(xp).reduce((sum, val) => sum + val, 0);

    // Level calculation (exponential scaling)
    // Level 1: 0 XP, Level 2: 1000 XP, Level 3: 2500 XP, etc.
    const level = Math.floor(Math.sqrt(totalXP / 100)) + 1;
    const currentLevelXP = Math.pow(level - 1, 2) * 100;
    const nextLevelXP = Math.pow(level, 2) * 100;
    const progressToNext = ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    return {
        level: Math.min(level, 100), // Cap at level 100
        totalXP,
        currentLevelXP,
        nextLevelXP,
        progressToNext: Math.round(progressToNext),
        xpBreakdown: xp,
        tier: getLevelTier(level)
    };
}

/**
 * Get level tier name
 */
function getLevelTier(level) {
    if (level >= 80) return 'Legendary';
    if (level >= 60) return 'Master';
    if (level >= 40) return 'Expert';
    if (level >= 20) return 'Advanced';
    if (level >= 10) return 'Intermediate';
    return 'Beginner';
}

/**
 * Get XP from documentation quality
 */
function getDocumentationXP(quality) {
    const xpMap = {
        'excellent': 1000,
        'good': 600,
        'inconsistent': 300,
        'poor': 100
    };
    return xpMap[quality] || 0;
}

/**
 * Detect earned achievements
 */
function detectAchievements(data) {
    const { repositories, contributions, metrics } = data;
    const achievements = [];

    const totalStars = repositories.reduce((sum, r) => sum + (r.stars || 0), 0);
    const activeRepos = repositories.filter(r => r.maturityStage === 'active').length;
    const avgHealthScore = repositories.reduce((sum, r) => sum + (r.healthScore || 0), 0) / repositories.length;

    // Streak achievements
    if (contributions.currentStreak >= 100) {
        achievements.push(createAchievement('marathon_coder', 'Marathon Coder', '🏃', 'Maintained a 100+ day coding streak', 'legendary'));
    } else if (contributions.currentStreak >= 30) {
        achievements.push(createAchievement('streak_master', 'Streak Master', '🔥', 'Maintained a 30+ day coding streak', 'rare'));
    }

    // Star achievements
    if (totalStars >= 1000) {
        achievements.push(createAchievement('superstar', 'Superstar', '🌟', 'Earned 1000+ stars across projects', 'legendary'));
    } else if (totalStars >= 500) {
        achievements.push(createAchievement('community_favorite', 'Community Favorite', '⭐', 'Earned 500+ stars across projects', 'epic'));
    } else if (totalStars >= 100) {
        achievements.push(createAchievement('rising_star', 'Rising Star', '✨', 'Earned 100+ stars across projects', 'rare'));
    }

    // Documentation achievements
    if (metrics.documentationHabits === 'excellent') {
        achievements.push(createAchievement('documentation_hero', 'Documentation Hero', '📚', 'Maintains excellent documentation', 'rare'));
    }

    // Repository achievements
    if (repositories.length >= 50) {
        achievements.push(createAchievement('prolific_creator', 'Prolific Creator', '🚀', 'Created 50+ repositories', 'epic'));
    } else if (repositories.length >= 20) {
        achievements.push(createAchievement('prolific_builder', 'Prolific Builder', '🔨', 'Created 20+ repositories', 'rare'));
    }

    // Quality achievements
    if (avgHealthScore >= 80) {
        achievements.push(createAchievement('quality_craftsman', 'Quality Craftsman', '💎', 'Maintains high code quality', 'rare'));
    }

    // Impact achievements
    if (metrics.impactScore >= 80) {
        achievements.push(createAchievement('open_source_legend', 'Open Source Legend', '🏆', 'Exceptional community impact', 'legendary'));
    } else if (metrics.impactScore >= 70) {
        achievements.push(createAchievement('open_source_champion', 'Open Source Champion', '🎖️', 'Strong community impact', 'epic'));
    }

    // Consistency achievements
    if (metrics.consistencyScore >= 80) {
        achievements.push(createAchievement('specialist', 'Specialist', '🎯', 'Deep expertise and consistency', 'rare'));
    } else if (metrics.consistencyScore >= 70) {
        achievements.push(createAchievement('consistent_contributor', 'Consistent Contributor', '📈', 'Maintains steady contribution rhythm', 'uncommon'));
    }

    // Language achievements
    if (metrics.skills.length >= 10) {
        achievements.push(createAchievement('polyglot_master', 'Polyglot Master', '🌐', 'Proficient in 10+ languages', 'epic'));
    } else if (metrics.skills.length >= 5) {
        achievements.push(createAchievement('polyglot', 'Polyglot', '🌈', 'Proficient in 5+ languages', 'rare'));
    }

    // Active project achievements
    if (activeRepos >= 10) {
        achievements.push(createAchievement('juggler', 'Juggler', '🤹', 'Maintains 10+ active projects', 'rare'));
    }

    // Commit achievements
    if (contributions.totalCommits >= 5000) {
        achievements.push(createAchievement('commit_legend', 'Commit Legend', '⚡', '5000+ total commits', 'legendary'));
    } else if (contributions.totalCommits >= 1000) {
        achievements.push(createAchievement('commit_master', 'Commit Master', '💪', '1000+ total commits', 'epic'));
    }

    return achievements;
}

/**
 * Create achievement object
 */
function createAchievement(id, name, icon, description, rarity) {
    return {
        id,
        name,
        icon,
        description,
        rarity, // common, uncommon, rare, epic, legendary
        earnedAt: new Date()
    };
}

/**
 * Calculate skill proficiency levels
 */
function calculateSkillLevels(skills, repositories) {
    return skills.map(skill => {
        const repoCount = skill.evidenceCount;
        const totalBytes = skill.totalLines;
        const daysSinceUse = Math.floor((new Date() - new Date(skill.lastUsed)) / (1000 * 60 * 60 * 24));

        // Calculate proficiency (0-100)
        let proficiency = 0;
        proficiency += Math.min(repoCount * 10, 40); // Max 40 from repo count
        proficiency += Math.min(totalBytes / 10000, 40); // Max 40 from code volume
        proficiency += Math.max(20 - daysSinceUse / 30, 0); // Max 20 from recency

        const level = getProficiencyLevel(proficiency);

        return {
            ...skill,
            proficiency: Math.round(proficiency),
            level,
            recentlyUsed: daysSinceUse < 90
        };
    });
}

/**
 * Get proficiency level name
 */
function getProficiencyLevel(proficiency) {
    if (proficiency >= 80) return 'Expert';
    if (proficiency >= 60) return 'Advanced';
    if (proficiency >= 40) return 'Intermediate';
    if (proficiency >= 20) return 'Beginner';
    return 'Novice';
}

/**
 * Generate developer stats summary
 */
function generateStatsSummary(data) {
    const { repositories, contributions, metrics } = data;

    return {
        totalProjects: repositories.length,
        activeProjects: repositories.filter(r => r.maturityStage === 'active').length,
        totalStars: repositories.reduce((sum, r) => sum + (r.stars || 0), 0),
        totalForks: repositories.reduce((sum, r) => sum + (r.forks || 0), 0),
        totalCommits: contributions.totalCommits,
        currentStreak: contributions.currentStreak,
        longestStreak: contributions.longestStreak,
        languages: metrics.skills.length,
        avgHealthScore: Math.round(repositories.reduce((sum, r) => sum + (r.healthScore || 0), 0) / repositories.length),
        devScore: metrics.devScore,
        consistencyScore: metrics.consistencyScore,
        impactScore: metrics.impactScore
    };
}

/**
 * Calculate percentile rankings (compared to average developer)
 */
function calculatePercentiles(data) {
    const stats = generateStatsSummary(data);

    // Benchmarks (approximate averages)
    const benchmarks = {
        totalProjects: 15,
        totalStars: 50,
        totalCommits: 500,
        longestStreak: 20,
        languages: 3,
        devScore: 50
    };

    return {
        projects: calculatePercentile(stats.totalProjects, benchmarks.totalProjects),
        stars: calculatePercentile(stats.totalStars, benchmarks.totalStars),
        commits: calculatePercentile(stats.totalCommits, benchmarks.totalCommits),
        streak: calculatePercentile(stats.longestStreak, benchmarks.longestStreak),
        languages: calculatePercentile(stats.languages, benchmarks.languages),
        overall: calculatePercentile(stats.devScore, benchmarks.devScore)
    };
}

/**
 * Calculate percentile (simplified)
 */
function calculatePercentile(value, benchmark) {
    const percentile = Math.min(Math.round((value / benchmark) * 50 + 25), 99);
    return Math.max(percentile, 1);
}

module.exports = {
    calculateLevel,
    detectAchievements,
    calculateSkillLevels,
    generateStatsSummary,
    calculatePercentiles,
    getLevelTier,
    getProficiencyLevel
};
