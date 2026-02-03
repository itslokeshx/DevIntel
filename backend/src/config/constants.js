// Application-wide constants

module.exports = {
    // Cache TTL (Time To Live)
    CACHE_TTL_DAYS: 7,

    // GitHub API
    GITHUB_API_BASE: 'https://api.github.com',
    GITHUB_RATE_LIMIT: 5000, // requests per hour for authenticated users

    // Score thresholds
    SCORE_THRESHOLDS: {
        EXCELLENT: 80,
        GOOD: 60,
        AVERAGE: 40,
        POOR: 20
    },

    // Maturity stages
    MATURITY_STAGES: {
        IDEA: 'idea',
        ACTIVE: 'active',
        STABLE: 'stable',
        ABANDONED: 'abandoned'
    },

    // Skill levels
    SKILL_LEVELS: {
        BEGINNER: 'beginner',
        INTERMEDIATE: 'intermediate',
        ADVANCED: 'advanced',
        EXPERT: 'expert'
    },

    // Activity patterns
    ACTIVITY_PATTERNS: {
        CONSISTENT: 'consistent',
        BURST: 'burst',
        SPORADIC: 'sporadic',
        COMEBACK: 'comeback'
    },

    // Documentation quality
    DOC_QUALITY: {
        NONE: 'none',
        BASIC: 'basic',
        GOOD: 'good',
        EXCELLENT: 'excellent'
    }
};
