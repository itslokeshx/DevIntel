const User = require('../models/User');
const GitHubData = require('../models/GitHubData');
const ComparisonCache = require('../models/ComparisonCache');
const { analyzeGitHubUser } = require('../services/github/analyzer');
const { generateGitHubInsights } = require('../services/ai/insights');
const { generateContent } = require('../services/ai/gemini');

// Helper to get or analyze user data
async function ensureUserData(username) {
    // 1. Try to find in DB
    let data = await GitHubData.findOne({
        username: username.toLowerCase().trim()
    }).sort({ createdAt: -1 });

    if (data && data.expiresAt > new Date()) {
        return data;
    }

    // 2. If not found or expired, analyze
    console.log(`Analyzing GitHub user for comparison: ${username}`);
    const analyzedData = await analyzeGitHubUser(username);

    // Generate AI insights
    const aiInsights = await generateGitHubInsights({
        ...analyzedData,
        username
    });

    // Find or create user
    const user = await User.findOneAndUpdate(
        { githubUsername: username },
        { githubUsername: username },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Store GitHub data
    data = await GitHubData.create({
        userId: user._id,
        username,
        profile: analyzedData.profile,
        repositories: analyzedData.repositories,
        contributions: analyzedData.contributions,
        metrics: analyzedData.metrics,
        aiInsights
    });

    return data;
}

// Compare two GitHub users
exports.compareUsers = async (req, res) => {
    try {
        const { usernameA, usernameB } = req.body;

        if (!usernameA || !usernameB) {
            return res.status(400).json({
                success: false,
                error: { message: 'Both usernameA and usernameB are required' }
            });
        }

        // Create comparison key (sorted alphabetically for consistency)
        const comparisonKey = [usernameA, usernameB].sort().join('-');

        // Check cache first
        const cached = await ComparisonCache.findOne({ comparisonKey });
        // Return cached if valid and both users exist in our DB (sanity check)
        if (cached && cached.expiresAt > new Date()) {
            return res.json({
                success: true,
                data: {
                    userA: cached.userAData,
                    userB: cached.userBData,
                    comparison: cached.comparison
                }
            });
        }

        // Ensure we have data for both users
        const [userAData, userBData] = await Promise.all([
            ensureUserData(usernameA),
            ensureUserData(usernameB)
        ]);

        if (!userAData || !userBData) {
            throw new Error('Failed to retrieve data for one or both users');
        }

        // Generate comparison metrics
        const comparison = generateComparisonMetrics(userAData, userBData);

        // Generate AI comparative analysis
        const aiVerdict = await generateComparativeAnalysis(userAData, userBData, comparison);
        comparison.aiVerdict = aiVerdict;

        // Cache the comparison
        await ComparisonCache.findOneAndUpdate(
            { comparisonKey },
            {
                comparisonKey,
                userA: usernameA,
                userB: usernameB,
                userAData,
                userBData,
                comparison,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            },
            { upsert: true, new: true }
        );

        res.json({
            success: true,
            data: {
                userA: userAData,
                userB: userBData,
                comparison
            }
        });

    } catch (error) {
        console.error('Error comparing users:', error);
        res.status(500).json({
            success: false,
            error: { message: error.message || 'Failed to compare users' }
        });
    }
};

function generateComparisonMetrics(userA, userB) {
    const metrics = {
        devScore: {
            userA: userA.metrics.devScore,
            userB: userB.metrics.devScore,
            winner: userA.metrics.devScore > userB.metrics.devScore ? 'A' : 'B',
            difference: Math.abs(userA.metrics.devScore - userB.metrics.devScore)
        },
        consistencyScore: {
            userA: userA.metrics.consistencyScore,
            userB: userB.metrics.consistencyScore,
            winner: userA.metrics.consistencyScore > userB.metrics.consistencyScore ? 'A' : 'B',
            difference: Math.abs(userA.metrics.consistencyScore - userB.metrics.consistencyScore)
        },
        impactScore: {
            userA: userA.metrics.impactScore,
            userB: userB.metrics.impactScore,
            winner: userA.metrics.impactScore > userB.metrics.impactScore ? 'A' : 'B',
            difference: Math.abs(userA.metrics.impactScore - userB.metrics.impactScore)
        },
        totalProjects: {
            userA: userA.repositories.length,
            userB: userB.repositories.length,
            winner: userA.repositories.length > userB.repositories.length ? 'A' : 'B',
            difference: Math.abs(userA.repositories.length - userB.repositories.length)
        },
        activeProjects: {
            userA: userA.repositories.filter(r => r.maturityStage === 'active').length,
            userB: userB.repositories.filter(r => r.maturityStage === 'active').length,
            winner: null,
            difference: 0
        },
        totalCommits: {
            userA: userA.contributions.totalCommits,
            userB: userB.contributions.totalCommits,
            winner: userA.contributions.totalCommits > userB.contributions.totalCommits ? 'A' : 'B',
            difference: Math.abs(userA.contributions.totalCommits - userB.contributions.totalCommits)
        },
        currentStreak: {
            userA: userA.contributions.currentStreak,
            userB: userB.contributions.currentStreak,
            winner: userA.contributions.currentStreak > userB.contributions.currentStreak ? 'A' : 'B',
            difference: Math.abs(userA.contributions.currentStreak - userB.contributions.currentStreak)
        },
        totalStars: {
            userA: userA.repositories.reduce((sum, r) => sum + (r.stars || 0), 0),
            userB: userB.repositories.reduce((sum, r) => sum + (r.stars || 0), 0),
            winner: null,
            difference: 0
        },
        avgDocQuality: {
            userA: calculateAvgDocQuality(userA.repositories),
            userB: calculateAvgDocQuality(userB.repositories),
            winner: null,
            difference: 0
        }
    };

    // Calculate winners for remaining metrics
    metrics.activeProjects.winner = metrics.activeProjects.userA > metrics.activeProjects.userB ? 'A' : 'B';
    metrics.activeProjects.difference = Math.abs(metrics.activeProjects.userA - metrics.activeProjects.userB);

    metrics.totalStars.winner = metrics.totalStars.userA > metrics.totalStars.userB ? 'A' : 'B';
    metrics.totalStars.difference = Math.abs(metrics.totalStars.userA - metrics.totalStars.userB);

    metrics.avgDocQuality.winner = metrics.avgDocQuality.userA > metrics.avgDocQuality.userB ? 'A' : 'B';
    metrics.avgDocQuality.difference = Math.abs(metrics.avgDocQuality.userA - metrics.avgDocQuality.userB);

    // Tech stack comparison
    const techStackA = userA.metrics.skills?.map(s => s.name) || [];
    const techStackB = userB.metrics.skills?.map(s => s.name) || [];

    const shared = techStackA.filter(tech => techStackB.includes(tech));
    const uniqueA = techStackA.filter(tech => !techStackB.includes(tech));
    const uniqueB = techStackB.filter(tech => !techStackA.includes(tech));

    metrics.techStack = {
        shared,
        uniqueA,
        uniqueB,
        overlapPercentage: Math.round((shared.length / Math.max(techStackA.length, techStackB.length)) * 100)
    };

    return metrics;
}

function calculateAvgDocQuality(repositories) {
    if (!repositories || repositories.length === 0) return 0;

    const qualityMap = {
        'excellent': 100,
        'good': 75,
        'basic': 50,
        'minimal': 25
    };

    const sum = repositories.reduce((total, repo) => {
        return total + (qualityMap[repo.documentationQuality] || 0);
    }, 0);

    return Math.round(sum / repositories.length);
}

async function generateComparativeAnalysis(userA, userB, metrics) {
    const prompt = `Compare these two GitHub developers objectively:

Developer A (${userA.username}):
- Dev Score: ${metrics.devScore.userA}/100
- Consistency: ${metrics.consistencyScore.userA}/100
- Impact: ${metrics.impactScore.userA}/100
- Projects: ${metrics.totalProjects.userA} (${metrics.activeProjects.userA} active)
- Total Commits: ${metrics.totalCommits.userA}
- Stars Earned: ${metrics.totalStars.userA}
- Primary Tech: ${userA.metrics.primaryTechIdentity}

Developer B (${userB.username}):
- Dev Score: ${metrics.devScore.userB}/100
- Consistency: ${metrics.consistencyScore.userB}/100
- Impact: ${metrics.impactScore.userB}/100
- Projects: ${metrics.totalProjects.userB} (${metrics.activeProjects.userB} active)
- Total Commits: ${metrics.totalCommits.userB}
- Stars Earned: ${metrics.totalStars.userB}
- Primary Tech: ${userB.metrics.primaryTechIdentity}

Tech Stack Overlap: ${metrics.techStack.overlapPercentage}%
Shared Technologies: ${metrics.techStack.shared.join(', ')}

Write a 3-4 sentence objective comparison highlighting:
1. Different development approaches and strengths
2. Complementary skills or similar expertise
3. Notable differences in activity patterns or project focus

Be balanced and avoid declaring one "better" - focus on different strengths and styles.`;

    try {
        const analysis = await generateContent(prompt);
        return analysis;
    } catch (error) {
        console.error('Error generating comparative analysis:', error);
        return `${userA.username} and ${userB.username} demonstrate different development approaches. ${userA.username} focuses on ${userA.metrics.primaryTechIdentity} with ${metrics.totalProjects.userA} projects, while ${userB.username} specializes in ${userB.metrics.primaryTechIdentity} with ${metrics.totalProjects.userB} projects. Both developers show unique strengths in their respective areas.`;
    }
}

// Get cached comparison
exports.getComparison = async (req, res) => {
    try {
        const { userA, userB } = req.params;
        const comparisonKey = [userA, userB].sort().join('-');

        const cached = await ComparisonCache.findOne({ comparisonKey });

        if (!cached || cached.expiresAt < new Date()) {
            return res.status(404).json({
                success: false,
                error: { message: 'Comparison not found or expired' }
            });
        }

        res.json({
            success: true,
            data: {
                userA: cached.userAData,
                userB: cached.userBData,
                comparison: cached.comparison
            }
        });
    } catch (error) {
        console.error('Error fetching comparison:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch comparison' }
        });
    }
};

module.exports = exports;
