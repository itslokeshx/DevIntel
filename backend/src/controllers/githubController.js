const User = require('../models/User');
const GitHubData = require('../models/GitHubData');
const { analyzeGitHubUser } = require('../services/github/analyzer');
const { generateGitHubInsights } = require('../services/ai/insights');
const { streamContent } = require('../services/ai/groq');
const cache = require('../services/cache/kv');
const { getAIVerdictPrompt } = require('../services/ai/prompts');

/**
 * POST /api/github/analyze
 * Analyze a GitHub user and return fresh results (no caching)
 */
async function analyzeUser(req, res, next) {
    try {
        const username = req.body.githubUsername?.toLowerCase().trim();

        if (!username) {
            return res.status(400).json({
                success: false,
                error: { message: 'GitHub username is required' }
            });
        }

        console.log(`[Analyze Request] ${username}`);

        // Check GitHub data cache (5 min TTL)
        const githubCacheKey = cache.constructor.githubProfileKey(username);
        let analyzedData = await cache.get(githubCacheKey);
        let githubCached = false;

        if (!analyzedData) {
            console.log(`[GitHub] Fetching fresh data for ${username}`);
            analyzedData = await analyzeGitHubUser(username);
            await cache.set(githubCacheKey, analyzedData, 300); // 5 min
        } else {
            githubCached = true;
            console.log(`[GitHub] Using cached data for ${username}`);
        }

        // Check AI insights cache (24 hr TTL)
        const aiCacheKey = cache.constructor.aiInsightsKey(username);
        let aiInsights = await cache.get(aiCacheKey);
        let aiCached = false;

        if (!aiInsights) {
            console.log(`[AI] Generating fresh insights for ${username}`);
            aiInsights = await generateGitHubInsights({
                ...analyzedData,
                username
            });
            await cache.set(aiCacheKey, aiInsights, 86400); // 24 hr
        } else {
            aiCached = true;
            console.log(`[AI] Using cached insights for ${username}`);
        }

        // Log cache statistics
        const stats = cache.getStats();
        console.log(`[Cache Stats] Hits: ${stats.hits}, Misses: ${stats.misses}, Hit Rate: ${stats.hitRate}`);

        // Return data with cache info
        const responseData = {
            username,
            profile: analyzedData.profile,
            repositories: analyzedData.repositories,
            contributions: analyzedData.contributions,
            metrics: analyzedData.metrics,
            yearlyBreakdown: analyzedData.yearlyBreakdown,
            aiInsights
        };

        console.log('📊 Data summary:');
        console.log(`   Repos: ${responseData.repositories.length}`);
        console.log(`   Total commits: ${responseData.contributions.totalCommits}`);
        console.log(`   Current streak: ${responseData.contributions.currentStreak}`);

        res.json({
            success: true,
            data: responseData,
            cache: {
                github: githubCached,
                ai: aiCached,
                stats: stats
            }
        });

    } catch (error) {
        console.error('Error analyzing GitHub user:', error);
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
