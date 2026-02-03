const mongoose = require('mongoose');

const leetCodeDataSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    profile: {
        realName: String,
        avatarUrl: String,
        ranking: Number,
        reputation: Number,
        country: String,
        skills: [String],
        about: String
    },
    stats: {
        totalSolved: Number,
        easySolved: Number,
        mediumSolved: Number,
        hardSolved: Number,
        acceptanceRate: Number,
        totalQuestions: Number,
        easyTotal: Number,
        mediumTotal: Number,
        hardTotal: Number,
        contributionPoints: Number
    },
    submissionCalendar: Object, // Heatmap data
    recentSubmissions: [{
        title: String,
        titleSlug: String,
        timestamp: Date,
        status: String,
        lang: String,
        difficulty: String // Added by us if possible, or need to fetch
    }],
    badges: [{
        name: String,
        icon: String,
        category: String
    }],
    aiInsights: {
        verdict: String,
        strengths: [String],
        weaknesses: [String],
        recommendedFocus: String,
        developerType: String // e.g., "Consistent Practicer", "Algorithm Specialist"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        index: { expires: 0 } // TTL index
    }
});

// Calculate metrics before saving
leetCodeDataSchema.pre('save', function (next) {
    // Set expiration to 24 hours
    if (!this.expiresAt) {
        this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
    next();
});

module.exports = mongoose.model('LeetCodeData', leetCodeDataSchema);
