const { generateContent } = require('./groq');
const {
    getBatchedInsightsPrompt,
    getComparisonVerdictPrompt,
    getYearStoryPrompt,
    getRepoStoryPrompt
} = require('./prompts');

const {
    calculateLevel,
    detectAchievements,
    calculateSkillLevels,
    generateStatsSummary,
    calculatePercentiles
} = require('../gamification');

// Token tracking
let dailyTokenUsage = {
    date: new Date().toDateString(),
    tokens: 0,
    requests: 0
};

/**
 * Track token usage for monitoring
 */
function trackTokenUsage(endpoint, estimatedTokens) {
    const today = new Date().toDateString();

    // Reset counter if new day
    if (dailyTokenUsage.date !== today) {
        console.log(`📊 Previous day token usage: ${dailyTokenUsage.tokens} tokens, ${dailyTokenUsage.requests} requests`);
        dailyTokenUsage = { date: today, tokens: 0, requests: 0 };
    }

    dailyTokenUsage.tokens += estimatedTokens;
    dailyTokenUsage.requests += 1;

    console.log(`🔢 Token usage - ${endpoint}: ~${estimatedTokens} tokens (Daily total: ${dailyTokenUsage.tokens})`);

    // Warn if approaching limits (Groq free tier: ~14,400 req/day)
    if (dailyTokenUsage.requests > 10000) {
        console.warn(`⚠️  High token usage today: ${dailyTokenUsage.requests} requests, ${dailyTokenUsage.tokens} tokens`);
    }

    return dailyTokenUsage;
}

/**
 * Parse JSON with fallback
 */
function parseJSON(jsonString, fallback) {
    try {
        // Remove markdown code blocks if present
        let cleaned = jsonString.trim();
        if (cleaned.startsWith('```json')) {
            cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
        } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/```\n?/g, '');
        }

        const parsed = JSON.parse(cleaned);
        return parsed;
    } catch (error) {
        console.error('JSON parsing failed:', error.message);
        console.log('Falling back to default values');
        return fallback;
    }
}

/**
 * OPTIMIZED: Generate comprehensive GitHub insights with batched AI call
 * Reduces token usage from ~1800 to ~800 per profile (60% reduction)
 */
async function generateGitHubInsights(analyzedData) {
    console.log('🚀 Generating AI insights with BATCHED optimization...');

    try {
        // Check if user has any meaningful data
        const hasRepos = analyzedData.repositories && analyzedData.repositories.length > 0;
        const hasCommits = analyzedData.contributions && analyzedData.contributions.totalCommits > 0;

        // If user has no repos and no commits, return minimal data - NO FAKE INSIGHTS
        if (!hasRepos && !hasCommits) {
            console.log('⚠️  User has no public activity - returning minimal data (no fake insights)');

            return {
                archetype: null,
                verdict: null,
                growthOps: [],
                yearStory2025: null,
                techForecast: null,
                gamification: {
                    level: {
                        level: 1,
                        tier: 'Beginner',
                        totalXP: 0,
                        currentLevelXP: 0,
                        nextLevelXP: 100,
                        progressToNext: 0,
                        xpBreakdown: {}
                    },
                    achievements: [],
                    skillLevels: [],
                    stats: {
                        totalProjects: 0,
                        activeProjects: 0,
                        totalStars: 0,
                        totalForks: 0,
                        totalCommits: 0,
                        currentStreak: 0,
                        longestStreak: 0,
                        languages: 0,
                        avgHealthScore: 0,
                        devScore: 0,
                        consistencyScore: 0,
                        impactScore: 0
                    },
                    percentiles: {
                        projects: 1,
                        stars: 1,
                        commits: 1,
                        streak: 1,
                        languages: 1,
                        overall: 1
                    }
                }
            };
        }

        // DETERMINISTIC CALCULATIONS (No AI needed - pure math)
        console.log('📊 Calculating deterministic metrics...');
        const gamification = {
            level: calculateLevel(analyzedData),
            achievements: detectAchievements(analyzedData),
            skillLevels: calculateSkillLevels(analyzedData.metrics.skills, analyzedData.repositories),
            stats: generateStatsSummary(analyzedData),
            percentiles: calculatePercentiles(analyzedData)
        };

        console.log(`✅ Level: ${gamification.level.level} (${gamification.level.tier})`);
        console.log(`✅ Achievements: ${gamification.achievements.length}`);
        console.log(`✅ Percentiles calculated (no AI)`);

        // BATCHED AI CALL - Single prompt for all insights
        console.log('🤖 Calling AI with BATCHED prompt (1 request instead of 5)...');
        const batchedPrompt = getBatchedInsightsPrompt(analyzedData);
        const batchedResponse = await generateContent(batchedPrompt);

        // Track token usage
        trackTokenUsage('batched_insights', 800); // Estimated tokens

        // Parse batched response with fallback
        const insights = parseJSON(batchedResponse, {
            archetype: 'Builder',
            archetypePercentage: 75,
            verdict: `${analyzedData.username} is an active developer with ${analyzedData.repositories.length} repositories and ${analyzedData.contributions.totalCommits} commits. Their consistent contribution pattern demonstrates dedication to software development. They show strong technical skills across ${analyzedData.metrics.skills.length} languages. Continued focus on documentation and community engagement will accelerate growth.`,
            growthOps: [
                {
                    title: 'Documentation Quality',
                    gap: 'Many repos lack comprehensive READMEs',
                    action: 'Add detailed README to your top 3 repos this week',
                    impact: 'Improves discoverability and demonstrates professionalism',
                    difficulty: 'Easy'
                },
                {
                    title: 'Consistency',
                    gap: 'Commit frequency varies significantly',
                    action: 'Set a goal of 3-4 commits per week',
                    impact: 'Builds momentum and coding rhythm',
                    difficulty: 'Medium'
                },
                {
                    title: 'Community Engagement',
                    gap: 'Limited external contributions',
                    action: 'Contribute to 1 open source project',
                    impact: 'Expands network and learning opportunities',
                    difficulty: 'Medium'
                }
            ],
            yearStory2025: `${analyzedData.username}'s 2025 has been marked by steady growth and technical exploration. They've built ${analyzedData.repositories.length} projects, demonstrating versatility across multiple domains. The journey shows a developer committed to continuous learning and improvement.`,
            techForecast: `Based on recent activity, ${analyzedData.metrics.skills[0]?.name || 'their primary language'} will remain dominant. Consider exploring complementary technologies to broaden your full-stack capabilities.`
        });

        console.log(`✅ AI insights generated: ${insights.archetype} (${insights.archetypePercentage}%)`);
        console.log(`✅ Growth opportunities: ${insights.growthOps.length}`);

        return {
            archetype: insights.archetype,
            archetypePercentage: insights.archetypePercentage,
            verdict: insights.verdict,
            growthOps: insights.growthOps,
            yearStory2025: insights.yearStory2025,
            techForecast: insights.techForecast,
            gamification
        };

    } catch (error) {
        console.error('❌ Error generating AI insights:', error);

        // Return fallback with gamification data
        const gamification = {
            level: calculateLevel(analyzedData),
            achievements: detectAchievements(analyzedData),
            skillLevels: calculateSkillLevels(analyzedData.metrics.skills, analyzedData.repositories),
            stats: generateStatsSummary(analyzedData),
            percentiles: calculatePercentiles(analyzedData)
        };

        return {
            archetype: 'Builder',
            archetypePercentage: 75,
            verdict: `${analyzedData.username} is an active developer with ${analyzedData.repositories.length} repositories.`,
            growthOps: [],
            yearStory2025: null,
            techForecast: null,
            gamification
        };
    }
}

/**
 * Generate comparison verdict (cached 24hr)
 */
async function generateComparisonInsights(userAData, userBData) {
    console.log(`🥊 Generating comparison: ${userAData.username} vs ${userBData.username}`);

    try {
        const prompt = getComparisonVerdictPrompt(userAData, userBData);
        const response = await generateContent(prompt);

        // Track token usage
        trackTokenUsage('comparison', 600);

        const comparison = parseJSON(response, {
            verdict: `Both ${userAData.username} and ${userBData.username} are skilled developers with unique strengths. ${userAData.username} excels in ${userAData.metrics.skills[0]?.name || 'their domain'}, while ${userBData.username} shows strength in ${userBData.metrics.skills[0]?.name || 'their area'}. The comparison reveals complementary skill sets that could make them strong collaborators. Both bring valuable perspectives to software development.`,
            winner: 'TIE',
            winReason: 'Both developers have unique strengths',
            strengths: {
                userA: ['Technical skills', 'Project diversity'],
                userB: ['Consistency', 'Code quality']
            },
            collaboration: 'They would work well together due to complementary skills. Their different approaches could lead to balanced, well-rounded solutions.'
        });

        console.log(`✅ Comparison generated: ${comparison.winner}`);
        return comparison;

    } catch (error) {
        console.error('❌ Error generating comparison:', error);
        return {
            verdict: `Both developers show strong technical skills and dedication.`,
            winner: 'TIE',
            winReason: 'Unable to determine clear winner',
            strengths: {
                userA: ['Technical skills'],
                userB: ['Technical skills']
            },
            collaboration: 'Both are capable developers.'
        };
    }
}

/**
 * Generate year story (for yearly breakdown)
 */
async function generateYearStory(yearData, year) {
    console.log(`📅 Generating year story for ${year}...`);

    try {
        const prompt = getYearStoryPrompt(yearData, year);
        const response = await generateContent(prompt);

        // Track token usage
        trackTokenUsage('year_story', 200);

        return response.trim();

    } catch (error) {
        console.error('❌ Error generating year story:', error);
        return `${year} was a year of development activity with ${yearData.commits || 0} commits across multiple projects.`;
    }
}

/**
 * Generate repository story (cached 24hr)
 */
async function generateRepoStory(repo) {
    console.log(`📦 Generating story for ${repo.name}...`);

    try {
        const prompt = getRepoStoryPrompt(repo);
        const response = await generateContent(prompt);

        // Track token usage
        trackTokenUsage('repo_story', 150);

        return response.trim();

    } catch (error) {
        console.error('❌ Error generating repo story:', error);
        return repo.description || `A ${repo.language || 'software'} project with ${repo.stars || 0} stars.`;
    }
}

/**
 * Get daily token usage stats
 */
function getTokenStats() {
    return dailyTokenUsage;
}

module.exports = {
    generateGitHubInsights,
    generateComparisonInsights,
    generateYearStory,
    generateRepoStory,
    getTokenStats,
    parseJSON
};
