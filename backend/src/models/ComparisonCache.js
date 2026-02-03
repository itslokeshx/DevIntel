const mongoose = require('mongoose');

const comparisonCacheSchema = new mongoose.Schema({
    userA: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    userB: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    comparison: {
        projectMaturity: {
            userA: mongoose.Schema.Types.Mixed,
            userB: mongoose.Schema.Types.Mixed,
            winner: String // "userA", "userB", "tie"
        },
        consistency: {
            userA: Number,
            userB: Number,
            winner: String
        },
        impact: {
            userA: Number,
            userB: Number,
            winner: String
        },
        techOverlap: {
            shared: [String],
            userAUnique: [String],
            userBUnique: [String]
        },
        longTermFocus: {
            userA: String,
            userB: String
        }
    },

    aiVerdict: String, // Full paragraph comparison

    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
}, {
    timestamps: true
});

// Compound index for faster lookups (order doesn't matter)
comparisonCacheSchema.index({ userA: 1, userB: 1 });
comparisonCacheSchema.index({ userB: 1, userA: 1 });

module.exports = mongoose.model('ComparisonCache', comparisonCacheSchema);
