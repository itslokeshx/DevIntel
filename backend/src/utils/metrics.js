const { SKILL_LEVELS, MATURITY_STAGES, DOC_QUALITY, ACTIVITY_PATTERNS } = require('../config/constants');

/**
 * Calculate repository health score (0-100)
 */
function calculateRepoHealth(repo) {
    let score = 0;

    // Recent activity (30 points)
    const daysSinceUpdate = daysBetween(new Date(repo.pushedAt), new Date());
    if (daysSinceUpdate < 30) score += 30;
    else if (daysSinceUpdate < 90) score += 20;
    else if (daysSinceUpdate < 180) score += 10;

    // Documentation (20 points)
    if (repo.hasReadme) score += 10;
    if (repo.readmeLength && repo.readmeLength > 500) score += 10;

    // Community engagement (15 points)
    if (repo.stars > 10) score += 5;
    if (repo.stars > 50) score += 5;
    if (repo.forks > 5) score += 5;

    // Commit consistency (20 points)
    if (repo.commitFrequency === 'daily') score += 20;
    else if (repo.commitFrequency === 'weekly') score += 15;
    else if (repo.commitFrequency === 'monthly') score += 10;

    // License (15 points)
    if (repo.hasLicense) score += 15;

    return Math.min(score, 100);
}

/**
 * Determine repository maturity stage
 */
function determineMaturityStage(repo) {
    const age = daysBetween(new Date(repo.createdAt), new Date());
    const daysSinceUpdate = daysBetween(new Date(repo.pushedAt), new Date());
    const commits = repo.commitCount || 0;

    // Abandoned
    if (daysSinceUpdate > 180) return MATURITY_STAGES.ABANDONED;

    // Idea (new, few commits)
    if (age < 30 && commits < 10) return MATURITY_STAGES.IDEA;

    // Active (recent activity)
    if (daysSinceUpdate < 30) return MATURITY_STAGES.ACTIVE;

    // Stable (mature, irregular updates)
    if (age > 180 && commits > 50) return MATURITY_STAGES.STABLE;

    return MATURITY_STAGES.ACTIVE;
}

/**
 * Assess documentation quality
 */
function assessDocumentation(repo) {
    if (!repo.hasReadme) return DOC_QUALITY.NONE;

    const readmeLength = repo.readmeLength || 0;

    if (readmeLength < 200) return DOC_QUALITY.BASIC;
    if (readmeLength < 1000) return DOC_QUALITY.GOOD;
    return DOC_QUALITY.EXCELLENT;
}

/**
 * Calculate overall Dev Score (0-100)
 */
function calculateDevScore(consistencyScore, impactScore, qualityScore) {
    return Math.round(
        (consistencyScore * 0.4) +
        (impactScore * 0.3) +
        (qualityScore * 0.3)
    );
}

/**
 * Calculate consistency score based on commit patterns
 */
function calculateConsistencyScore(contributions) {
    if (!contributions) return 0;

    let score = 0;

    // Streak analysis (40 points)
    const streakScore = Math.min((contributions.longestStreak || 0) / 30, 1) * 40;
    score += streakScore;

    // Commit frequency variance (30 points)
    const avgCommits = contributions.averageCommitsPerDay || 0;
    if (avgCommits > 5) score += 30;
    else if (avgCommits > 2) score += 20;
    else if (avgCommits > 0.5) score += 10;

    // Gap analysis (30 points)
    const gaps = contributions.inactiveGaps || [];
    const longGaps = gaps.filter(g => g.durationDays > 60).length;
    if (longGaps === 0) score += 30;
    else if (longGaps === 1) score += 20;
    else if (longGaps === 2) score += 10;

    return Math.round(Math.min(score, 100));
}

/**
 * Calculate impact score based on community engagement
 */
function calculateImpactScore(repositories) {
    if (!repositories || repositories.length === 0) return 0;

    let score = 0;

    // Total stars/forks (40 points)
    const totalStars = repositories.reduce((sum, r) => sum + (r.stars || 0), 0);
    const totalForks = repositories.reduce((sum, r) => sum + (r.forks || 0), 0);

    const starScore = Math.min(totalStars / 100, 1) * 30;
    const forkScore = Math.min(totalForks / 50, 1) * 10;
    score += starScore + forkScore;

    // Project maturity distribution (30 points)
    const activeRepos = repositories.filter(r => r.maturityStage === MATURITY_STAGES.ACTIVE).length;
    const stableRepos = repositories.filter(r => r.maturityStage === MATURITY_STAGES.STABLE).length;
    const maturityScore = Math.min((activeRepos + stableRepos * 2) / repositories.length, 1) * 30;
    score += maturityScore;

    // Quality (30 points)
    const avgHealth = repositories.reduce((sum, r) => sum + (r.healthScore || 0), 0) / repositories.length;
    score += (avgHealth / 100) * 30;

    return Math.round(Math.min(score, 100));
}

/**
 * Calculate quality score based on documentation and code practices
 */
function calculateQualityScore(repositories) {
    if (!repositories || repositories.length === 0) return 0;

    let score = 0;

    // Documentation presence (50 points)
    const withReadme = repositories.filter(r => r.hasReadme).length;
    const docScore = (withReadme / repositories.length) * 50;
    score += docScore;

    // License presence (25 points)
    const withLicense = repositories.filter(r => r.hasLicense).length;
    const licenseScore = (withLicense / repositories.length) * 25;
    score += licenseScore;

    // Project completion rate (25 points)
    const completed = repositories.filter(r =>
        r.maturityStage === MATURITY_STAGES.STABLE ||
        r.maturityStage === MATURITY_STAGES.ACTIVE
    ).length;
    const completionScore = (completed / repositories.length) * 25;
    score += completionScore;

    return Math.round(Math.min(score, 100));
}

/**
 * Determine skill level based on usage
 */
function calculateSkillLevel(totalLines, evidenceCount, daysSinceLastUse) {
    let level = SKILL_LEVELS.BEGINNER;

    if (totalLines < 1000) level = SKILL_LEVELS.BEGINNER;
    else if (totalLines < 5000) level = SKILL_LEVELS.INTERMEDIATE;
    else if (totalLines < 20000) level = SKILL_LEVELS.ADVANCED;
    else level = SKILL_LEVELS.EXPERT;

    // Downgrade if not used recently
    if (daysSinceLastUse > 365 && level === SKILL_LEVELS.EXPERT) {
        level = SKILL_LEVELS.ADVANCED;
    }

    return level;
}

/**
 * Detect activity pattern
 */
function detectActivityPattern(contributions) {
    if (!contributions) return ACTIVITY_PATTERNS.SPORADIC;

    const avgCommits = contributions.averageCommitsPerDay || 0;
    const longestStreak = contributions.longestStreak || 0;
    const gaps = contributions.inactiveGaps || [];

    // Consistent: Regular commits, long streaks, few gaps
    if (avgCommits > 1 && longestStreak > 30 && gaps.length < 3) {
        return ACTIVITY_PATTERNS.CONSISTENT;
    }

    // Burst: High average but with gaps
    if (avgCommits > 2 && gaps.length >= 3) {
        return ACTIVITY_PATTERNS.BURST;
    }

    // Comeback: Long gap followed by recent activity
    if (gaps.length > 0 && contributions.currentStreak > 7) {
        const lastGap = gaps[gaps.length - 1];
        if (lastGap.durationDays > 90) {
            return ACTIVITY_PATTERNS.COMEBACK;
        }
    }

    return ACTIVITY_PATTERNS.SPORADIC;
}

/**
 * Helper: Calculate days between two dates
 */
function daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date2 - date1) / oneDay));
}

module.exports = {
    calculateRepoHealth,
    determineMaturityStage,
    assessDocumentation,
    calculateDevScore,
    calculateConsistencyScore,
    calculateImpactScore,
    calculateQualityScore,
    calculateSkillLevel,
    detectActivityPattern,
    daysBetween
};
