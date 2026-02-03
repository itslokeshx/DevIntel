const mongoose = require('mongoose');

const comparisonCacheSchema = new mongoose.Schema({
    comparisonKey: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userA: {
        type: String,
        required: true
    },
    userB: {
        type: String,
        required: true
    },

    // Cache the full user data snapshots to avoid refetching
    userAData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    userBData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },

    // The computed comparison metrics and AI verdict
    comparison: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // TTL index
    }
});

module.exports = mongoose.model('ComparisonCache', comparisonCacheSchema);
