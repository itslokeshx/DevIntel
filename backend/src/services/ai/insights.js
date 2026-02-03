const { generateContent, generateBatch } = require('./gemini');
const {
    getRepoSummaryPrompt,
    getDeveloperInsightPrompt,
    getActivityNarrativePrompt,
    getGrowthActionsPrompt,
    getDeveloperArchetypePrompt
} = require('./prompts');

/**
 * Generate all AI insights for a GitHub user analysis
 */
async function generateGitHubInsights(analyzedData) {
    console.log('Generating AI insights...');

    try {
        // Generate repository summaries (batch for top 10 repos)
        const topRepos = analyzedData.repositories
            .filter(r => r.maturityStage !== 'abandoned')
            .sort((a, b) => b.healthScore - a.healthScore)
            .slice(0, 10);

        console.log(`Generating summaries for ${topRepos.length} repositories...`);
        const repoPrompts = topRepos.map(repo => getRepoSummaryPrompt(repo));
        const repoSummaries = await generateBatch(repoPrompts);

        // Attach summaries to repositories
        topRepos.forEach((repo, index) => {
            repo.aiSummary = repoSummaries[index];
        });

        // Generate developer one-liner
        console.log('Generating developer insight...');
        const oneLineInsight = await generateContent(
            getDeveloperInsightPrompt(analyzedData)
        );

        // Generate activity narrative
        console.log('Generating activity narrative...');
        const activityNarrative = await generateContent(
            getActivityNarrativePrompt(
                analyzedData.contributions,
                analyzedData.metrics.activityPattern
            )
        );

        // Generate growth actions
        console.log('Generating growth actions...');
        const growthActionsRaw = await generateContent(
            getGrowthActionsPrompt(analyzedData)
        );

        // Parse growth actions (should be JSON array)
        let growthActions = [];
        try {
            growthActions = JSON.parse(growthActionsRaw);
        } catch (e) {
            // Fallback if not valid JSON
            growthActions = growthActionsRaw.split('\n').filter(line => line.trim()).slice(0, 3);
        }

        // Generate developer archetype
        console.log('Generating developer archetype...');
        const developerArchetype = await generateContent(
            getDeveloperArchetypePrompt(analyzedData)
        );

        return {
            oneLineInsight,
            activityNarrative,
            growthActions,
            developerArchetype,
            strengthsWeaknesses: {
                strengths: extractStrengths(analyzedData),
                improvements: extractImprovements(analyzedData)
            }
        };
    } catch (error) {
        console.error('Error generating AI insights:', error);

        // Return fallback insights
        return {
            oneLineInsight: 'Developer profile analysis in progress',
            activityNarrative: 'Activity pattern analysis in progress',
            growthActions: ['Continue building great projects'],
            developerArchetype: 'Builder',
            strengthsWeaknesses: {
                strengths: ['Active developer'],
                improvements: ['Keep learning']
            }
        };
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
    generateGitHubInsights
};
