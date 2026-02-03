const User = require('../models/User');
const GitHubData = require('../models/GitHubData');
const { analyzeGitHubUser } = require('../services/github/analyzer');
const { generateGitHubInsights } = require('../services/ai/insights');

/**
 * POST /api/github/analyze
 * Analyze a GitHub user and store results
 */
async function analyzeUser(req, res, next) {
    try {
        const { githubUsername } = req.body;

        if (!githubUsername) {
            const error = new Error('GitHub username is required');
            error.statusCode = 400;
            throw error;
        }

        const username = githubUsername.toLowerCase().trim();

        // Check if we have recent cached data
        const existingData = await GitHubData.findOne({
            username,
            expiresAt: { $gt: new Date() }
        });

        if (existingData) {
            console.log(`Returning cached data for ${username}`);
            return res.json({
                success: true,
                data: existingData,
                cached: true
            });
        }

        // Analyze GitHub user
        console.log(`Analyzing GitHub user: ${username}`);
        const analyzedData = await analyzeGitHubUser(username);

        // Generate AI insights
        const aiInsights = await generateGitHubInsights({
            ...analyzedData,
            username
        });

        // Find or create user
        let user = await User.findOne({ githubUsername: username });
        if (!user) {
            user = await User.create({ githubUsername: username });
        }

        // Store GitHub data
        const githubData = await GitHubData.create({
            userId: user._id,
            username,
            profile: analyzedData.profile,
            repositories: analyzedData.repositories,
            contributions: analyzedData.contributions,
            metrics: analyzedData.metrics,
            aiInsights
        });

        res.json({
            success: true,
            data: githubData,
            cached: false
        });

    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/github/:username
 * Get cached GitHub data for a user
 */
async function getUser(req, res, next) {
    try {
        const username = req.params.username.toLowerCase().trim();

        const githubData = await GitHubData.findOne({
            username,
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });

        if (!githubData) {
            const error = new Error(`No data found for GitHub user '${username}'. Please analyze first.`);
            error.statusCode = 404;
            throw error;
        }

        res.json({
            success: true,
            data: githubData
        });

    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/github/refresh/:username
 * Force refresh GitHub data
 */
async function refreshUser(req, res, next) {
    try {
        const username = req.params.username.toLowerCase().trim();

        // Delete old data
        await GitHubData.deleteMany({ username });

        // Re-analyze
        const analyzedData = await analyzeGitHubUser(username);
        const aiInsights = await generateGitHubInsights({
            ...analyzedData,
            username
        });

        // Find or create user
        let user = await User.findOne({ githubUsername: username });
        if (!user) {
            user = await User.create({ githubUsername: username });
        }

        // Store new data
        const githubData = await GitHubData.create({
            userId: user._id,
            username,
            profile: analyzedData.profile,
            repositories: analyzedData.repositories,
            contributions: analyzedData.contributions,
            metrics: analyzedData.metrics,
            aiInsights
        });

        res.json({
            success: true,
            data: githubData,
            refreshed: true
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    analyzeUser,
    getUser,
    refreshUser
};
