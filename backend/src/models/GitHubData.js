const mongoose = require('mongoose');

const githubDataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true,
        index: true
    },

    // Raw GitHub Profile Data
    profile: {
        name: String,
        bio: String,
        location: String,
        company: String,
        blog: String,
        avatarUrl: String,
        followers: Number,
        following: Number,
        publicRepos: Number,
        createdAt: Date
    },

    // Repositories Array
    repositories: [{
        name: String,
        description: String,
        url: String,
        stars: Number,
        forks: Number,
        watchers: Number,
        language: String,
        languages: mongoose.Schema.Types.Mixed, // {JavaScript: 45000, Python: 23000}
        topics: [String],
        createdAt: Date,
        updatedAt: Date,
        pushedAt: Date,
        size: Number,
        hasReadme: Boolean,
        readmeLength: Number,
        hasLicense: Boolean,
        isArchived: Boolean,
        isFork: Boolean,

        // Computed Repository Fields
        commitCount: Number,
        commitFrequency: String, // "daily", "weekly", "monthly", "sporadic"
        lastCommitDate: Date,
        ageInDays: Number,
        maturityStage: String, // "idea", "active", "stable", "abandoned"
        documentationQuality: String, // "none", "basic", "good", "excellent"
        healthScore: Number, // 0-100

        // AI-generated
        aiSummary: String,
        aiInsights: [String]
    }],

    // Contribution Activity
    contributions: {
        totalCommits: Number,
        commitsByMonth: [{
            month: String,
            count: Number
        }],
        longestStreak: Number,
        currentStreak: Number,
        averageCommitsPerDay: Number,
        busiestDay: String,
        busiestMonth: String,
        inactiveGaps: [{
            start: Date,
            end: Date,
            durationDays: Number
        }]
    },

    // Computed Metrics
    metrics: {
        devScore: Number, // 0-100 overall score
        consistencyScore: Number, // 0-100
        impactScore: Number, // 0-100
        primaryTechIdentity: String, // "Backend Developer", "Full-Stack", etc.

        // Skill breakdown
        skills: [{
            name: String,
            level: String, // "beginner", "intermediate", "advanced", "expert"
            evidenceCount: Number, // repos using this skill
            totalLines: Number,
            firstUsed: Date,
            lastUsed: Date
        }],

        // Activity patterns
        activityPattern: String, // "consistent", "burst", "sporadic", "comeback"
        projectFocus: String, // "deep", "broad", "balanced"
        documentationHabits: String // "poor", "inconsistent", "good", "excellent"
    },

    // AI-Generated Content
    aiInsights: {
        oneLineInsight: String,
        activityNarrative: String,
        growthActions: [String], // max 3
        developerArchetype: String,
        strengthsWeaknesses: {
            strengths: [String],
            improvements: [String]
        }
    },

    fetchedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
}, {
    timestamps: true
});

// Index for faster queries
githubDataSchema.index({ username: 1, expiresAt: 1 });

module.exports = mongoose.model('GitHubData', githubDataSchema);
