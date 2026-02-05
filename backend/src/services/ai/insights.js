const { generateContent } = require('./groq');
const {
    getDeveloperPersonalityPrompt,
    getRepositoryStoryPrompt,
    getGrowthTrajectoryPrompt,
    getAchievementDetectionPrompt,
    getSkillProgressionPrompt,
    getDetailedComparisonPrompt,
    // Legacy prompts
    getRepoSummaryPrompt,
    getDeveloperInsightPrompt,
    getActivityNarrativePrompt,
    getGrowthActionsPrompt,
    getDeveloperArchetypePrompt
} = require('./prompts');

const {
    calculateLevel,
    detectAchievements,
    calculateSkillLevels,
    generateStatsSummary,
    calculatePercentiles
} = require('../gamification');

/**
 * Generate comprehensive GitHub insights with enhanced AI and gamification
 */
async function generateGitHubInsights(analyzedData) {
    console.log('Generating enhanced AI insights with gamification...');

    try {
        // Calculate gamification data first (no AI needed)
        const gamification = {
            level: calculateLevel(analyzedData),
            achievements: detectAchievements(analyzedData),
            skillLevels: calculateSkillLevels(analyzedData.metrics.skills, analyzedData.repositories),
            stats: generateStatsSummary(analyzedData),
            percentiles: calculatePercentiles(analyzedData)
        };

        console.log(`Developer Level: ${gamification.level.level} (${gamification.level.tier})`);
        console.log(`Achievements Earned: ${gamification.achievements.length}`);

        // Generate AI insights in parallel for speed
        console.log('Generating AI-powered insights...');

        const [personalityRaw, growthTrajectoryRaw, topRepoStoriesRaw] = await Promise.all([
            // 1. Developer personality analysis
            generateContent(getDeveloperPersonalityPrompt(analyzedData)),

            // 2. Growth trajectory and recommendations
            generateContent(getGrowthTrajectoryPrompt(analyzedData)),

            // 3. Top 3 repository stories
            (async () => {
                const topRepos = analyzedData.repositories
                    .filter(r => r.maturityStage !== 'abandoned')
                    .sort((a, b) => b.healthScore - a.healthScore)
                    .slice(0, 3);

                if (topRepos.length === 0) return null;

                // Generate stories for top repos
                const stories = await Promise.all(
                    topRepos.map(repo => generateContent(getRepositoryStoryPrompt(repo)))
                );

                return stories.map((story, index) => ({
                    repoName: topRepos[index].name,
                    story: story || `${topRepos[index].language || 'Software'} project with ${topRepos[index].stars} stars`
                }));
            })()
        ]);

        // Parse AI responses
        const personality = parseJSON(personalityRaw, {
            archetype: 'Builder',
            codingStyle: 'Methodical developer',
            workPattern: 'Consistent contributor',
            strengths: ['Active development', 'Technical skills', 'Project creation'],
            traits: ['Dedicated', 'Skilled', 'Productive', 'Focused'],
            motivations: 'Driven by creating impactful software solutions'
        });

        const growthTrajectory = parseJSON(growthTrajectoryRaw, {
            currentLevel: 'Intermediate',
            nextMilestone: 'Increase project impact and community engagement',
            recommendations: [
                {
                    area: 'Documentation',
                    action: 'Add comprehensive READMEs to top projects',
                    impact: 'Improves project discoverability and adoption',
                    difficulty: 'Easy'
                }
            ],
            learningPath: ['Improve documentation', 'Increase consistency', 'Engage with community'],
            timeframe: '3-6 months'
        });

        // Attach repo stories to repositories
        if (topRepoStoriesRaw) {
            topRepoStoriesRaw.forEach(({ repoName, story }) => {
                const repo = analyzedData.repositories.find(r => r.name === repoName);
                if (repo) {
                    repo.aiStory = story;
                }
            });
        }

        // Generate quick summary insights (legacy format for compatibility)
        const quickInsight = `${personality.archetype} with ${personality.codingStyle.toLowerCase()} approach`;
        const activityNarrative = `${personality.workPattern}. ${personality.motivations}`;

        return {
            // Enhanced insights
            personality,
            growthTrajectory,
            gamification,

            // Legacy insights (for backward compatibility)
            oneLineInsight: quickInsight,
            activityNarrative,
            growthActions: growthTrajectory.recommendations.map(r => r.action).slice(0, 3),
            developerArchetype: personality.archetype,
            strengthsWeaknesses: {
                strengths: personality.strengths,
                improvements: growthTrajectory.recommendations.map(r => r.area)
            }
        };

    } catch (error) {
        console.error('Error generating AI insights:', error);

        // Return fallback with gamification data
        const gamification = {
            level: calculateLevel(analyzedData),
            achievements: detectAchievements(analyzedData),
            skillLevels: calculateSkillLevels(analyzedData.metrics.skills, analyzedData.repositories),
            stats: generateStatsSummary(analyzedData),
            percentiles: calculatePercentiles(analyzedData)
        };

        return {
            personality: {
                archetype: 'Builder',
                codingStyle: 'Active developer',
                workPattern: 'Regular contributor',
                strengths: ['Software development', 'Technical skills'],
                traits: ['Dedicated', 'Skilled'],
                motivations: 'Building software solutions'
            },
            growthTrajectory: {
                currentLevel: 'Intermediate',
                nextMilestone: 'Continue building great projects',
                recommendations: [
                    {
                        area: 'Consistency',
                        action: 'Maintain regular contribution schedule',
                        impact: 'Improves development rhythm',
                        difficulty: 'Medium'
                    }
                ],
                learningPath: ['Keep coding', 'Learn new technologies', 'Share knowledge'],
                timeframe: '6 months'
            },
            gamification,
            oneLineInsight: 'Active developer with diverse technical skills',
            activityNarrative: 'Maintains regular contribution pattern',
            growthActions: ['Continue building', 'Improve documentation', 'Engage with community'],
            developerArchetype: 'Builder',
            strengthsWeaknesses: {
                strengths: ['Active development'],
                improvements: ['Documentation', 'Consistency']
            }
        };
    }
}

/**
 * Generate detailed comparison insights
 */
async function generateComparisonInsights(userAData, userBData, metrics) {
    console.log('Generating detailed comparison insights...');

    try {
        const comparisonRaw = await generateContent(
            getDetailedComparisonPrompt(userAData, userBData, metrics)
        );

        const comparison = parseJSON(comparisonRaw, {
            summary: `${userAData.username} and ${userBData.username} demonstrate different development approaches and strengths.`,
            strengths: {
                userA: ['Technical expertise', 'Project quality'],
                userB: ['Consistent activity', 'Diverse skills']
            },
            differences: [
                {
                    aspect: 'Development approach',
                    userA: 'Focused on quality',
                    userB: 'Focused on quantity'
                }
            ],
            collaboration: 'Both developers bring unique strengths that could complement each other well in a team setting.',
            verdict: 'Each developer excels in different areas, making direct comparison less meaningful than understanding their unique contributions.'
        });

        return comparison;

    } catch (error) {
        console.error('Error generating comparison insights:', error);
        return {
            summary: `${userAData.username} and ${userBData.username} show different development patterns.`,
            strengths: {
                userA: ['Active development'],
                userB: ['Technical skills']
            },
            differences: [],
            collaboration: 'Both developers have unique strengths.',
            verdict: 'Each developer brings different skills and approaches to software development.'
        };
    }
}

/**
 * Helper: Parse JSON with fallback
 */
function parseJSON(raw, fallback) {
    if (!raw) return fallback;

    try {
        // Remove markdown code blocks
        let cleanJson = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Find JSON object
        const firstBrace = cleanJson.indexOf('{');
        const lastBrace = cleanJson.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1) {
            cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
        }

        return JSON.parse(cleanJson);
    } catch (e) {
        console.error('Failed to parse JSON:', e.message);
        return fallback;
    }
}

/**
 * Extract strengths from analyzed data
 */
function extractStrengths(data) {
    const strengths = [];

    if (data.metrics.consistencyScore > 70) {
        strengths.push('Consistent contribution pattern');
    }

    if (data.metrics.impactScore > 70) {
        strengths.push('Strong community impact');
    }

    if (data.metrics.documentationHabits === 'excellent' || data.metrics.documentationHabits === 'good') {
        strengths.push('Good documentation practices');
    }

    if (data.metrics.skills.length > 5) {
        strengths.push('Diverse technical skill set');
    }

    const activeRepos = data.repositories.filter(r => r.maturityStage === 'active').length;
    if (activeRepos > 5) {
        strengths.push('Maintains multiple active projects');
    }

    return strengths.slice(0, 3);
}

/**
 * Extract improvement areas from analyzed data
 */
function extractImprovements(data) {
    const improvements = [];

    if (data.metrics.consistencyScore < 50) {
        improvements.push('Establish more consistent contribution rhythm');
    }

    if (data.metrics.documentationHabits === 'poor' || data.metrics.documentationHabits === 'inconsistent') {
        improvements.push('Improve project documentation');
    }

    const abandonedRepos = data.repositories.filter(r => r.maturityStage === 'abandoned').length;
    if (abandonedRepos > 5) {
        improvements.push('Archive or revive abandoned projects');
    }

    const reposWithoutReadme = data.repositories.filter(r => !r.hasReadme).length;
    if (reposWithoutReadme > 3) {
        improvements.push('Add READMEs to projects');
    }

    if (data.metrics.impactScore < 40) {
        improvements.push('Focus on community engagement');
    }

    return improvements.slice(0, 3);
}

module.exports = {
    generateGitHubInsights,
    generateComparisonInsights
};
