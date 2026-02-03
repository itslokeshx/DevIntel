const ComparisonCache = require('../models/ComparisonCache');
const GitHubData = require('../models/GitHubData');
const { generateContent } = require('../services/ai/gemini');
const { getComparisonVerdictPrompt } = require('../services/ai/prompts');

/**
 * POST /api/compare
 * Compare two GitHub users
 */
async function compareUsers(req, res, next) {
    try {
        const { userA, userB } = req.body;

        if (!userA || !userB) {
            const error = new Error('Both userA and userB are required');
            error.statusCode = 400;
            throw error;
        }

        const usernameA = userA.toLowerCase().trim();
        const usernameB = userB.toLowerCase().trim();

        if (usernameA === usernameB) {
            const error = new Error('Cannot compare a user with themselves');
            error.statusCode = 400;
            throw error;
        }

        // Check for cached comparison (order doesn't matter)
        const existingComparison = await ComparisonCache.findOne({
            $or: [
                { userA: usernameA, userB: usernameB },
                { userA: usernameB, userB: usernameA }
            ],
            expiresAt: { $gt: new Date() }
        });

        if (existingComparison) {
            console.log(`Returning cached comparison for ${usernameA} vs ${usernameB}`);
            return res.json({
                success: true,
                data: existingComparison,
                cached: true
            });
        }

        // Fetch both users' data
        const dataA = await GitHubData.findOne({
            username: usernameA,
            expiresAt: { $gt: new Date() }
        });

        const dataB = await GitHubData.findOne({
            username: usernameB,
            expiresAt: { $gt: new Date() }
        });

        if (!dataA) {
            const error = new Error(`No data found for user '${usernameA}'. Please analyze first.`);
            error.statusCode = 404;
            throw error;
        }

        if (!dataB) {
            const error = new Error(`No data found for user '${usernameB}'. Please analyze first.`);
            error.statusCode = 404;
            throw error;
        }

        // Perform comparison
        const comparison = performComparison(dataA, dataB);

        // Generate AI verdict
        const aiVerdict = await generateContent(
            getComparisonVerdictPrompt(
                { username: usernameA, ...dataA.toObject() },
                { username: usernameB, ...dataB.toObject() }
            )
        );

        // Store comparison
        const comparisonCache = await ComparisonCache.create({
            userA: usernameA,
            userB: usernameB,
            comparison,
            aiVerdict
        });

        res.json({
            success: true,
            data: comparisonCache,
            cached: false
        });

    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/compare/:userA/:userB
 * Get cached comparison
 */
async function getComparison(req, res, next) {
    try {
        const usernameA = req.params.userA.toLowerCase().trim();
        const usernameB = req.params.userB.toLowerCase().trim();

        const comparison = await ComparisonCache.findOne({
            $or: [
                { userA: usernameA, userB: usernameB },
                { userA: usernameB, userB: usernameA }
            ],
            expiresAt: { $gt: new Date() }
        });

        if (!comparison) {
            const error = new Error(`No comparison found for ${usernameA} vs ${usernameB}`);
            error.statusCode = 404;
            throw error;
        }

        res.json({
            success: true,
            data: comparison
        });

    } catch (error) {
        next(error);
    }
}

/**
 * Perform comparison logic
 */
function performComparison(dataA, dataB) {
    // Project maturity comparison
    const projectMaturity = compareProjectMaturity(dataA.repositories, dataB.repositories);

    // Consistency comparison
    const consistency = {
        userA: dataA.metrics.consistencyScore,
        userB: dataB.metrics.consistencyScore,
        winner: dataA.metrics.consistencyScore > dataB.metrics.consistencyScore ? 'userA' :
            dataB.metrics.consistencyScore > dataA.metrics.consistencyScore ? 'userB' : 'tie'
    };

    // Impact comparison
    const impact = {
        userA: dataA.metrics.impactScore,
        userB: dataB.metrics.impactScore,
        winner: dataA.metrics.impactScore > dataB.metrics.impactScore ? 'userA' :
            dataB.metrics.impactScore > dataA.metrics.impactScore ? 'userB' : 'tie'
    };

    // Tech stack overlap
    const techOverlap = compareTechStack(dataA.metrics.skills, dataB.metrics.skills);

    // Long-term focus
    const longTermFocus = {
        userA: dataA.metrics.projectFocus,
        userB: dataB.metrics.projectFocus
    };

    return {
        projectMaturity,
        consistency,
        impact,
        techOverlap,
        longTermFocus
    };
}

function compareProjectMaturity(reposA, reposB) {
    const countByStage = (repos) => ({
        idea: repos.filter(r => r.maturityStage === 'idea').length,
        active: repos.filter(r => r.maturityStage === 'active').length,
        stable: repos.filter(r => r.maturityStage === 'stable').length,
        abandoned: repos.filter(r => r.maturityStage === 'abandoned').length
    });

    return {
        userA: countByStage(reposA),
        userB: countByStage(reposB),
        winner: 'tie' // Maturity is subjective, no clear winner
    };
}

function compareTechStack(skillsA, skillsB) {
    const techA = new Set(skillsA.map(s => s.name));
    const techB = new Set(skillsB.map(s => s.name));

    const shared = [...techA].filter(t => techB.has(t));
    const userAUnique = [...techA].filter(t => !techB.has(t));
    const userBUnique = [...techB].filter(t => !techA.has(t));

    return {
        shared,
        userAUnique,
        userBUnique
    };
}

module.exports = {
    compareUsers,
    getComparison
};
