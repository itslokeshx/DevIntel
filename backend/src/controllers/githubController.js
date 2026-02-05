const User = require('../models/User');
const GitHubData = require('../models/GitHubData');
const { analyzeGitHubUser } = require('../services/github/analyzer');
const { generateGitHubInsights } = require('../services/ai/insights');
const { streamContent } = require('../services/ai/groq');
const { getAIVerdictPrompt } = require('../services/ai/prompts');

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
            yearlyBreakdown: analyzedData.yearlyBreakdown, // Include yearly breakdown
            aiInsights
        };

        console.log('📊 Final data summary:');
        console.log(`   Repos: ${responseData.repositories.length}`);
        console.log(`   Total commits: ${responseData.contributions.totalCommits}`);
        console.log(`   Current streak: ${responseData.contributions.currentStreak}`);
        console.log(`   Calendar days: ${responseData.contributions.calendar?.length || 0}`);

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
            yearlyBreakdown: analyzedData.yearlyBreakdown, // Include yearly breakdown
            aiInsights
        };

        console.log('📊 Final data summary:');
        console.log(`   Repos: ${responseData.repositories.length}`);
        console.log(`   Total commits: ${responseData.contributions.totalCommits}`);
        console.log(`   Current streak: ${responseData.contributions.currentStreak}`);

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

/**
 * POST /api/github/ai-verdict
 * Stream AI verdict for a developer profile
 */
async function streamAIVerdict(req, res, next) {
    try {
        const { username, profileData } = req.body;

        if (!username || !profileData) {
            const error = new Error('Username and profile data are required');
            error.statusCode = 400;
            throw error;
        }

        // Set up SSE headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering in nginx

        // Generate prompt
        const prompt = getAIVerdictPrompt(profileData);

        // Stream the response
        try {
            const { streamContent } = require('../services/ai/groq');
            const stream = streamContent(prompt, {
                temperature: 0.7,
                max_tokens: 500
            });

            for await (const chunk of stream) {
                res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
                // Flush the response to ensure real-time streaming
                if (typeof res.flush === 'function') {
                    res.flush();
                }
            }

            res.write('data: [DONE]\n\n');
            res.end();
        } catch (streamError) {
            console.error('Streaming error:', streamError);
            res.write(`data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`);
            res.end();
        }

    } catch (error) {
        if (!res.headersSent) {
            next(error);
        } else {
            res.end();
        }
    }
}

module.exports = {
    analyzeUser,
    getUser,
    refreshUser,
    streamAIVerdict
};
