/**
 * AI Prompt Templates for DevIntel
 */

/**
 * Generate repository summary prompt
 */
function getRepoSummaryPrompt(repo) {
    return `You are analyzing a GitHub repository for a developer intelligence platform.

Repository: ${repo.name}
Description: ${repo.description || 'No description'}
README (first 500 words): ${repo.readmeContent || 'No README'}
Languages: ${JSON.stringify(repo.languages)}
Commit count: ${repo.commitCount || 0}
Last commit: ${repo.pushedAt ? repo.pushedAt.toISOString().split('T')[0] : 'Unknown'}
Created: ${repo.createdAt ? repo.createdAt.toISOString().split('T')[0] : 'Unknown'}

Task: Write a single, concise sentence (max 20 words) that explains what this project IS and what problem it solves. Focus on value, not tech stack.

Example good outputs:
- "A web scraper that monitors product prices and sends alerts when deals appear"
- "An automated backup system for MongoDB databases with S3 integration"
- "A React component library for building accessible data tables"

Your summary:`;
}

/**
 * Generate developer one-line insight prompt
 */
function getDeveloperInsightPrompt(data) {
    const topLanguages = data.metrics.skills.slice(0, 3).map(s => s.name).join(', ');

    return `You are analyzing a developer's GitHub activity for a developer intelligence platform.

Developer: ${data.username}
Total repos: ${data.repositories.length}
Active repos: ${data.repositories.filter(r => r.maturityStage === 'active').length}
Primary languages: ${topLanguages}
Consistency score: ${data.metrics.consistencyScore}/100
Documentation quality: ${data.metrics.documentationHabits}
Activity pattern: ${data.metrics.activityPattern}

Task: Write ONE sentence (max 25 words) that captures this developer's building style and habits. Be specific and actionable.

Examples:
- "Consistent builder with strong backend focus; documentation is inconsistent across projects"
- "Prolific experimenter who starts many projects but rarely maintains them long-term"
- "Meticulous full-stack developer who prioritizes polish and documentation"

Your insight:`;
}

/**
 * Generate activity pattern narrative prompt
 */
function getActivityNarrativePrompt(contributions, pattern) {
    return `Analyze this developer's GitHub contribution pattern:

Total commits: ${contributions.totalCommits}
Longest streak: ${contributions.longestStreak} days
Current streak: ${contributions.currentStreak} days
Inactive gaps: ${contributions.inactiveGaps.length} gaps
Activity pattern detected: ${pattern}

Task: Write 2-3 sentences explaining their development rhythm. What does their pattern reveal about their workflow?

Your insight:`;
}

/**
 * Generate growth actions prompt
 */
function getGrowthActionsPrompt(data) {
    const noReadmeRepos = data.repositories
        .filter(r => !r.hasReadme && r.maturityStage !== 'abandoned')
        .slice(0, 3)
        .map(r => r.name);

    const abandonedCount = data.repositories.filter(r => r.maturityStage === 'abandoned').length;

    return `Based on this developer's GitHub profile, suggest 1-3 specific, actionable improvements they can make THIS WEEK:

Active projects: ${data.repositories.filter(r => r.maturityStage === 'active').length}
Projects without README: ${noReadmeRepos.join(', ') || 'None'}
Abandoned projects: ${abandonedCount}
Documentation score: ${data.metrics.documentationHabits}
Consistency score: ${data.metrics.consistencyScore}/100
Activity pattern: ${data.metrics.activityPattern}

Rules:
- Max 3 suggestions
- Be SPECIFIC (name repos if relevant)
- Focus on quick wins
- Use encouraging tone

Format as a JSON array of strings.

Example:
["Add a detailed README to 'api-helper' to showcase its capabilities", "Complete or archive the 3 projects untouched in 6+ months", "Establish a weekly commit routine to improve consistency"]

Your suggestions (JSON array only):`;
}

/**
 * Generate developer archetype prompt
 */
function getDeveloperArchetypePrompt(data) {
    return `Classify this developer into ONE primary archetype based on their GitHub profile:

Project count: ${data.repositories.length}
Average project lifespan: ${Math.round(data.repositories.reduce((sum, r) => sum + r.ageInDays, 0) / data.repositories.length)} days
Documentation quality: ${data.metrics.documentationHabits}
Contribution frequency: ${data.metrics.activityPattern}
Primary tech: ${data.metrics.primaryTechIdentity}

Archetypes (choose ONE):
1. Builder - Focuses on creating and shipping products
2. Problem Solver - Prioritizes algorithmic thinking and competitive coding
3. Educator - Shares knowledge through writing and teaching
4. Experimenter - Explores many technologies, learns through building
5. Specialist - Deep expertise in specific domains
6. Balanced Polymath - Strong across multiple dimensions

Output ONLY the archetype name, nothing else.`;
}

/**
 * Generate comparison verdict prompt
 */
function getComparisonVerdictPrompt(userAData, userBData) {
    return `Compare these two GitHub developers objectively:

Developer A (${userAData.username}):
- Projects: ${userAData.repositories.length}
- Consistency: ${userAData.metrics.consistencyScore}/100
- Impact: ${userAData.metrics.impactScore}/100
- Tech stack: ${userAData.metrics.skills.slice(0, 3).map(s => s.name).join(', ')}
- Focus: ${userAData.metrics.projectFocus}

Developer B (${userBData.username}):
- Projects: ${userBData.repositories.length}
- Consistency: ${userBData.metrics.consistencyScore}/100
- Impact: ${userBData.metrics.impactScore}/100
- Tech stack: ${userBData.metrics.skills.slice(0, 3).map(s => s.name).join(', ')}
- Focus: ${userBData.metrics.projectFocus}

Task: Write a single paragraph (4-5 sentences) comparing their development approaches. Be balanced, specific, and avoid declaring a "winner". Focus on differences in style, focus, and execution.

Example:
"Developer A maintains fewer projects but invests deeply in each, with strong documentation and long-term commitment. Developer B experiments broadly across the stack, starting many projects to learn new technologies but maintaining fewer to completion. Both show consistent activity, though A's impact metrics are higher due to community traction, while B demonstrates wider technical versatility."

Your comparison:`;
}

module.exports = {
    getRepoSummaryPrompt,
    getDeveloperInsightPrompt,
    getActivityNarrativePrompt,
    getGrowthActionsPrompt,
    getDeveloperArchetypePrompt,
    getComparisonVerdictPrompt
};
