const User = require('../models/User');
const GitHubData = require('../models/GitHubData');
const { analyzeGitHubUser } = require('../services/github/analyzer');
const { generateGitHubInsights } = require('../services/ai/insights');

/**
 * POST /api/github/analyze
 * Analyze a GitHub user and return fresh results (no caching)
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

        // Always analyze fresh - no caching
        console.log(`Analyzing GitHub user: ${username}`);
        const analyzedData = await analyzeGitHubUser(username);

        // Generate AI insights with gamification
        console.log('Generating enhanced AI insights...');
        const aiInsights = await generateGitHubInsights({
            ...analyzedData,
            username
        });

        console.log('✅ Analysis complete with gamification!');
        console.log(`   Level: ${aiInsights.gamification.level.level}`);
        console.log(`   Achievements: ${aiInsights.gamification.achievements.length}`);

        // Return fresh data directly (no database storage)
        const responseData = {
            username,
            profile: analyzedData.profile,
            repositories: analyzedData.repositories,
            contributions: analyzedData.contributions,
            metrics: analyzedData.metrics,
            aiInsights
        };

        res.json({
            success: true,
            data: responseData,
            cached: false
        });

    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/github/:username
 * Analyze and return GitHub data (no caching)
 */
async function getUser(req, res, next) {
    try {
        const username = req.params.username.toLowerCase().trim();

        // Just analyze fresh every time
        console.log(`Analyzing GitHub user: ${username}`);
        const analyzedData = await analyzeGitHubUser(username);

        // Generate AI insights
        const aiInsights = await generateGitHubInsights({
            ...analyzedData,
            username
        });

        const responseData = {
            username,
            profile: analyzedData.profile,
            repositories: analyzedData.repositories,
            contributions: analyzedData.contributions,
            metrics: analyzedData.metrics,
            aiInsights
        };

        res.json({
            success: true,
            data: responseData
        });

    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/github/refresh/:username
 * Same as getUser - always fresh
 */
async function refreshUser(req, res, next) {
    // Just call getUser since we're always fresh now
    req.params.username = req.params.username;
    return getUser(req, res, next);
}

module.exports = {
    analyzeUser,
    getUser,
    refreshUser
};
