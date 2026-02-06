/**
 * OPTIMIZED AI Prompt Templates for DevIntel Premium
 * Single batched prompt to reduce token usage by 60%
 */

/**
 * BATCHED INSIGHTS PROMPT - Combines all AI insights into one call
 * Target: 800 tokens per profile (down from 1800)
 */
function getBatchedInsightsPrompt(data) {
  const username = data.username;
  const repos = data.repositories?.length || 0;
  const stars = data.repositories?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0;
  const commits = data.contributions?.totalCommits || 0;
  const currentStreak = data.contributions?.currentStreak || 0;
  const longestStreak = data.contributions?.longestStreak || 0;
  const topLanguages = data.metrics?.skills?.slice(0, 5).map(s => s.name).join(', ') || 'N/A';
  const devScore = data.metrics?.devScore || 0;
  const consistencyScore = data.metrics?.consistencyScore || 0;
  const impactScore = data.metrics?.impactScore || 0;

  // Calculate documentation quality
  const reposWithReadme = (data.repositories || []).filter(r => r.hasReadme).length;
  const docScore = repos > 0 ? Math.round((reposWithReadme / repos) * 100) : 0;

  return `You are a senior tech analyst. Analyze this developer and return ONLY valid JSON.

DEVELOPER DATA:
- Username: ${username}
- Repositories: ${repos}
- Total Stars: ${stars}
- Total Commits: ${commits}
- Current Streak: ${currentStreak} days
- Longest Streak: ${longestStreak} days
- Top Languages: ${topLanguages}
- Dev Score: ${devScore}/100
- Consistency: ${consistencyScore}/100
- Impact: ${impactScore}/100
- Documentation: ${docScore}%

TASK: Return this EXACT JSON structure:

{
  "archetype": "Builder | Architect | Explorer | Specialist",
  "archetypePercentage": 85,
  "verdict": "4-sentence analysis: (1) Identify archetype and strength, (2) Highlight unique pattern, (3) Mention surprising insight, (4) Forward-looking statement",
  "growthOps": [
    {
      "title": "Specific improvement area",
      "gap": "What's missing (metric or behavior)",
      "action": "Concrete action to take this week",
      "impact": "Why this matters for career/skills",
      "difficulty": "Easy | Medium | Hard"
    }
  ],
  "yearStory2025": "3-sentence narrative: What defined their 2025 coding journey",
  "techForecast": "2-sentence prediction: Which languages trending up/down, what to explore next"
}

ARCHETYPE RULES:
- Builder (80%+): Many repos, practical projects
- Architect (60%+): Few repos, high stars, well-documented
- Explorer (50%+): Diverse languages, experimental
- Specialist (70%+): Focused on 1-2 domains

GROWTH OPS RULES:
- Provide 3 recommendations
- Prioritize quick wins (high impact, low effort)
- Be specific, not generic
- Focus on gaps holding them back

Return ONLY the JSON, no markdown, no explanation.`;
}

/**
 * COMPARISON VERDICT PROMPT - Optimized for battles
 */
function getComparisonVerdictPrompt(userAData, userBData) {
  const userA = {
    username: userAData.username,
    repos: userAData.repositories?.length || 0,
    stars: userAData.repositories?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0,
    commits: userAData.contributions?.totalCommits || 0,
    streak: userAData.contributions?.currentStreak || 0,
    languages: userAData.metrics?.skills?.slice(0, 3).map(s => s.name).join(', ') || 'N/A',
    devScore: userAData.metrics?.devScore || 0
  };

  const userB = {
    username: userBData.username,
    repos: userBData.repositories?.length || 0,
    stars: userBData.repositories?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0,
    commits: userBData.contributions?.totalCommits || 0,
    streak: userBData.contributions?.currentStreak || 0,
    languages: userBData.metrics?.skills?.slice(0, 3).map(s => s.name).join(', ') || 'N/A',
    devScore: userBData.metrics?.devScore || 0
  };

  return `You are an impartial tech analyst comparing two developers. Return ONLY valid JSON.

DEVELOPER A (@${userA.username}):
- Repos: ${userA.repos} | Stars: ${userA.stars} | Commits: ${userA.commits}
- Streak: ${userA.streak} days | Languages: ${userA.languages}
- Dev Score: ${userA.devScore}/100

DEVELOPER B (@${userB.username}):
- Repos: ${userB.repos} | Stars: ${userB.stars} | Commits: ${userB.commits}
- Streak: ${userB.streak} days | Languages: ${userB.languages}
- Dev Score: ${userB.devScore}/100

TASK: Return this EXACT JSON structure:

{
  "verdict": "4-paragraph comparison: (1) Opening - who they are, (2) A's strengths, (3) B's strengths, (4) Verdict - context matters, both valuable",
  "winner": "${userA.username} | ${userB.username} | TIE",
  "winReason": "Brief explanation of why (or why it's a tie)",
  "strengths": {
    "userA": ["strength 1", "strength 2"],
    "userB": ["strength 1", "strength 2"]
  },
  "collaboration": "Would they work well together? Why? (2 sentences)"
}

RULES:
- Be fair and respectful
- If skill gap is massive, be honest but kind
- If similar, focus on subtle differences
- Avoid declaring absolute winners unless clear

Return ONLY the JSON, no markdown.`;
}

/**
 * YEAR STORY PROMPT - For yearly breakdown
 */
function getYearStoryPrompt(yearData, year) {
  return `Generate a 3-sentence narrative for this developer's ${year} journey.

YEAR DATA:
- Commits: ${yearData.commits || 0}
- Repos Created: ${yearData.reposCreated || 0}
- Stars Earned: ${yearData.starsEarned || 0}
- Top Language: ${yearData.topLanguage || 'N/A'}
- Peak Month: ${yearData.peakMonth || 'N/A'}

Write 3 sentences:
1. What defined their year (theme/focus)
2. Key milestone or achievement
3. How they evolved or what changed

Be specific, celebratory, and honest. Return plain text only.`;
}

/**
 * REPOSITORY STORY PROMPT - For individual repos
 */
function getRepoStoryPrompt(repo) {
  return `Write a 2-sentence story about this repository.

REPO DATA:
- Name: ${repo.name}
- Description: ${repo.description || 'No description'}
- Language: ${repo.language || 'Multiple'}
- Stars: ${repo.stars || 0}
- Commits: ${repo.commitCount || 0}
- Has README: ${repo.hasReadme ? 'Yes' : 'No'}

Sentence 1: What problem it solves or what it does
Sentence 2: Technical insight or current state

Be specific, not generic. No hype words. Return plain text only.`;
}

/**
 * Legacy prompts for backward compatibility
 */
function getDeveloperPersonalityPrompt(data) {
  const topLanguages = data.metrics.skills.slice(0, 5).map(s => s.name).join(', ');
  const activeRepos = data.repositories.filter(r => r.maturityStage === 'active').length;
  const totalRepos = data.repositories.length;

  return `You are an expert developer psychologist analyzing GitHub behavior patterns.

DEVELOPER PROFILE:
Username: ${data.username}
Total Projects: ${totalRepos} (${activeRepos} active)
Primary Languages: ${topLanguages}
Dev Score: ${data.metrics.devScore}/100
Consistency: ${data.metrics.consistencyScore}/100
Impact: ${data.metrics.impactScore}/100
Activity Pattern: ${data.metrics.activityPattern}
Project Focus: ${data.metrics.projectFocus}
Documentation: ${data.metrics.documentationHabits}

CONTRIBUTION PATTERN:
Total Commits: ${data.contributions.totalCommits}
Current Streak: ${data.contributions.currentStreak} days
Longest Streak: ${data.contributions.longestStreak} days
Avg Commits/Day: ${data.contributions.averageCommitsPerDay}

TASK: Analyze this developer's personality and provide a JSON response with:

{
  "archetype": "One of: Builder, Explorer, Specialist, Maintainer, Educator, Problem Solver",
  "codingStyle": "2-3 word description (e.g., 'Methodical and thorough', 'Fast and iterative')",
  "workPattern": "Brief description of their work rhythm",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "traits": ["trait 1", "trait 2", "trait 3", "trait 4"],
  "motivations": "What drives this developer (1 sentence)"
}

Be specific and insightful. Base everything on the data provided.`;
}

function getGrowthTrajectoryPrompt(data) {
  const weakAreas = [];
  if (data.metrics.consistencyScore < 60) weakAreas.push('consistency');
  if (data.metrics.documentationHabits === 'poor' || data.metrics.documentationHabits === 'inconsistent') weakAreas.push('documentation');
  if (data.repositories.filter(r => r.maturityStage === 'abandoned').length > 5) weakAreas.push('project completion');
  if (data.metrics.impactScore < 40) weakAreas.push('community engagement');

  return `You are a senior developer mentor creating a personalized growth plan.

DEVELOPER STATS:
Username: ${data.username}
Dev Score: ${data.metrics.devScore}/100
Consistency: ${data.metrics.consistencyScore}/100
Impact: ${data.metrics.impactScore}/100
Primary Tech: ${data.metrics.primaryTechIdentity}
Skills: ${data.metrics.skills.slice(0, 5).map(s => s.name).join(', ')}
Active Projects: ${data.repositories.filter(r => r.maturityStage === 'active').length}
Abandoned Projects: ${data.repositories.filter(r => r.maturityStage === 'abandoned').length}

IDENTIFIED WEAK AREAS: ${weakAreas.join(', ') || 'None - strong across the board'}

TASK: Create a personalized growth plan as JSON:

{
  "currentLevel": "Beginner/Intermediate/Advanced/Expert",
  "nextMilestone": "Specific achievable goal",
  "recommendations": [
    {
      "area": "Specific area to improve",
      "action": "Concrete action to take this week",
      "impact": "Why this matters",
      "difficulty": "Easy/Medium/Hard"
    }
  ],
  "learningPath": ["Step 1", "Step 2", "Step 3"],
  "timeframe": "Realistic timeframe for next level"
}

Provide 3-4 recommendations. Be specific, actionable, and encouraging.`;
}

function getDetailedComparisonPrompt(userAData, userBData, metrics) {
  return `You are comparing two developers for a head-to-head analysis. Be objective, specific, and insightful.

DEVELOPER A (${userAData.username}):
- Dev Score: ${metrics.devScore.userA}/100
- Consistency: ${metrics.consistencyScore.userA}/100
- Impact: ${metrics.impactScore.userA}/100
- Projects: ${metrics.totalProjects.userA} (${metrics.activeProjects.userA} active)
- Total Commits: ${metrics.totalCommits.userA}
- Stars: ${metrics.totalStars.userA}
- Primary Tech: ${userAData.metrics.primaryTechIdentity}
- Top Skills: ${userAData.metrics.skills.slice(0, 3).map(s => s.name).join(', ')}
- Activity: ${userAData.metrics.activityPattern}

DEVELOPER B (${userBData.username}):
- Dev Score: ${metrics.devScore.userB}/100
- Consistency: ${metrics.consistencyScore.userB}/100
- Impact: ${metrics.impactScore.userB}/100
- Projects: ${metrics.totalProjects.userB} (${metrics.activeProjects.userB} active)
- Total Commits: ${metrics.totalCommits.userB}
- Stars: ${metrics.totalStars.userB}
- Primary Tech: ${userBData.metrics.primaryTechIdentity}
- Top Skills: ${userBData.metrics.skills.slice(0, 3).map(s => s.name).join(', ')}
- Activity: ${userBData.metrics.activityPattern}

TECH OVERLAP: ${metrics.techStack.overlapPercentage}%
SHARED SKILLS: ${metrics.techStack.shared.join(', ') || 'None'}

TASK: Provide detailed comparison as JSON:

{
  "summary": "2-3 sentence overview of key differences",
  "strengths": {
    "userA": ["strength 1", "strength 2"],
    "userB": ["strength 1", "strength 2"]
  },
  "differences": [
    {
      "aspect": "What differs",
      "userA": "A's approach",
      "userB": "B's approach"
    }
  ],
  "collaboration": "Would they work well together? Why? (2 sentences)",
  "verdict": "Balanced conclusion without declaring a winner (2 sentences)"
}

Be specific and avoid generic statements.`;
}

// Simple utility prompts
function getRepoSummaryPrompt(repo) {
  return `Summarize this repository in ONE compelling sentence (max 20 words):

Name: ${repo.name}
Description: ${repo.description || 'No description'}
Language: ${repo.language || 'Multiple'}
Stars: ${repo.stars}

Focus on what problem it solves, not the tech stack.`;
}

function getDeveloperArchetypePrompt(data) {
  return `Classify this developer as ONE archetype:

Projects: ${data.repositories.length}
Documentation: ${data.metrics.documentationHabits}
Pattern: ${data.metrics.activityPattern}

Choose: Builder, Problem Solver, Educator, Experimenter, Specialist, or Balanced Polymath

Return ONLY the archetype name.`;
}

/**
 * STREAMING VERDICT PROMPT - Lightweight for fast "first impression"
 */
function getAIVerdictPrompt(data) {
  const username = data.username;
  const repos = data.repositories?.length || 0;
  const stars = data.repositories?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0;
  const commits = data.contributions?.totalCommits || 0;
  const topLanguages = data.metrics?.skills?.slice(0, 5).map(s => s.name).join(', ') || 'N/A';

  return `You are a senior tech recruiter giving a quick 3-sentence verdict on this developer profile.

User: ${username}
Repos: ${repos} | Stars: ${stars} | Commits: ${commits}
Languages: ${topLanguages}

Give a professional, energetic verdict on their coding style and potential.
Format: Plain text, no markdown.`;
}

module.exports = {
  // OPTIMIZED BATCHED PROMPTS (Primary)
  getBatchedInsightsPrompt,
  getAIVerdictPrompt, // Restored for streaming endpoint
  getComparisonVerdictPrompt,
  getYearStoryPrompt,
  getRepoStoryPrompt,

  // Legacy prompts (for backward compatibility)
  getDeveloperPersonalityPrompt,
  getGrowthTrajectoryPrompt,
  getDetailedComparisonPrompt,
  getRepoSummaryPrompt,
  getDeveloperArchetypePrompt
};
