const { generateContent, generateBatch } = require('./openrouter');
const {
    getRepoSummaryPrompt,
    getDeveloperInsightPrompt,
    getActivityNarrativePrompt,
    getGrowthActionsPrompt,
    getDeveloperArchetypePrompt
} = require('./prompts');

async function generateGitHubInsights(analyzedData) {
    console.log('Generating AI insights...');

    try {
        // OPTIMIZATION: Combine all insights into 2 API calls to fit within 5 requests/minute limit

        // Call 1: Generate all developer insights in one prompt
        console.log('Generating comprehensive developer insights...');
        const developerPrompt = `Analyze this GitHub developer profile and provide insights in JSON format:

Developer Stats:
- Dev Score: ${analyzedData.metrics.devScore}/100
- Consistency Score: ${analyzedData.metrics.consistencyScore}/100
- Impact Score: ${analyzedData.metrics.impactScore}/100
- Activity Pattern: ${analyzedData.metrics.activityPattern}
- Primary Tech: ${analyzedData.metrics.primaryTechIdentity}
- Total Repos: ${analyzedData.repositories.length}
- Active Repos: ${analyzedData.repositories.filter(r => r.maturityStage === 'active').length}
- Abandoned Repos: ${analyzedData.repositories.filter(r => r.maturityStage === 'abandoned').length}
- Top Skills: ${analyzedData.metrics.skills.slice(0, 5).map(s => s.name).join(', ')}

Contribution Pattern:
- Total Commits: ${analyzedData.contributions.totalCommits}
- Longest Streak: ${analyzedData.contributions.longestStreak} days
- Current Streak: ${analyzedData.contributions.currentStreak} days
- Busiest Month: ${analyzedData.contributions.busiestMonth}

Respond with ONLY valid JSON (no markdown, no code blocks):
{
  "oneLineInsight": "A single compelling sentence describing this developer",
  "activityNarrative": "2-3 sentences about their coding rhythm and patterns",
  "developerArchetype": "One word: Builder/Maintainer/Explorer/Specialist",
  "growthActions": ["action 1", "action 2", "action 3"]
}`;

        const developerInsightsRaw = await generateContent(developerPrompt);

        // Parse JSON response
        let developerInsights;

        if (!developerInsightsRaw) {
            console.log('AI unavailable, using fallback insights');
            developerInsights = {
                oneLineInsight: 'Skilled developer with diverse technical expertise',
                activityNarrative: 'Active contributor with consistent coding patterns',
                developerArchetype: 'Builder',
                growthActions: ['Continue building great projects', 'Expand technical skills', 'Engage with community']
            };
        } else {
            try {
                // Remove markdown code blocks if present
                const cleanJson = developerInsightsRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                developerInsights = JSON.parse(cleanJson);
            } catch (e) {
                console.error('Failed to parse developer insights JSON:', e);
                // Fallback
                developerInsights = {
                    oneLineInsight: 'Skilled developer with diverse technical expertise',
                    activityNarrative: 'Active contributor with consistent coding patterns',
                    developerArchetype: 'Builder',
                    growthActions: ['Continue building great projects', 'Expand technical skills', 'Engage with community']
                };
            }
        }

        // Call 2: Generate top 3 repo summaries only (not 10)
        const topRepos = analyzedData.repositories
            .filter(r => r.maturityStage !== 'abandoned')
            .sort((a, b) => b.healthScore - a.healthScore)
            .slice(0, 3);

        console.log(`Generating summaries for top ${topRepos.length} repositories...`);

        if (topRepos.length > 0) {
            const repoSummaryPrompt = `Generate brief one-line summaries for these GitHub repositories. Respond with ONLY a JSON array of strings (no markdown):

${topRepos.map((repo, i) => `${i + 1}. ${repo.name}: ${repo.description || 'No description'} (${repo.language || 'Unknown'}, ${repo.stars} stars, Health: ${repo.healthScore}/100)`).join('\n')}

Format: ["summary 1", "summary 2", "summary 3"]`;

            const repoSummariesRaw = await generateContent(repoSummaryPrompt);

            if (!repoSummariesRaw) {
                // Return fallback summaries
                topRepos.forEach(repo => {
                    repo.aiSummary = `${repo.language || 'Software'} project with ${repo.stars} stars`;
                });
            } else {
                try {
                    const cleanJson = repoSummariesRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                    const repoSummaries = JSON.parse(cleanJson);
                    topRepos.forEach((repo, index) => {
                        repo.aiSummary = repoSummaries[index] || 'Interesting project';
                    });
                } catch (e) {
                    console.error('Failed to parse repo summaries:', e);
                    // Fallback summaries
                    topRepos.forEach(repo => {
                        repo.aiSummary = `${repo.language || 'Software'} project with ${repo.stars} stars`;
                    });
                }
            }
        }

        return {
            oneLineInsight: developerInsights.oneLineInsight,
            activityNarrative: developerInsights.activityNarrative,
            growthActions: Array.isArray(developerInsights.growthActions) ? developerInsights.growthActions : ['Keep building', 'Stay consistent', 'Engage with community'],
            developerArchetype: developerInsights.developerArchetype,
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
