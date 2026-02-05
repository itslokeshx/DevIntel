/**
 * Enhanced AI Prompt Templates for DevIntel Premium
 * Leveraging Groq's Llama 3.3 70B for detailed, personalized insights
 */

/**
 * Generate comprehensive developer personality analysis
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

/**
 * Generate engaging repository story
 */
function getRepositoryStoryPrompt(repo) {
    return `You are a technical storyteller. Create a compelling narrative about this GitHub repository.

REPOSITORY DATA:
Name: ${repo.name}
Description: ${repo.description || 'No description'}
Language: ${repo.language || 'Multiple'}
Stars: ${repo.stars}
Commits: ${repo.commitCount || 0}
Age: ${repo.ageInDays} days
Health Score: ${repo.healthScore}/100
Maturity: ${repo.maturityStage}
Documentation: ${repo.documentationQuality}
Last Updated: ${repo.updatedAt ? new Date(repo.updatedAt).toLocaleDateString() : 'Unknown'}

README EXCERPT:
${repo.readmeContent ? repo.readmeContent.substring(0, 500) : 'No README available'}

TASK: Write a compelling 2-3 sentence story that:
1. Explains what problem this project solves
2. Highlights what makes it interesting or unique
3. Mentions its current state and potential

Be engaging and specific. Avoid generic descriptions.

Example: "A real-time collaborative whiteboard that brings remote teams together through seamless drawing and annotation. Built with WebSockets for instant synchronization, it's gained traction with 127 stars and active development. The clean codebase and excellent documentation suggest a project ready for production use."

Your story:`;
}

/**
 * Generate personalized growth trajectory
 */
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

/**
 * Generate achievement detection
 */
function getAchievementDetectionPrompt(data) {
    return `You are an achievement system analyzer. Detect which badges this developer has earned.

DEVELOPER METRICS:
Total Commits: ${data.contributions.totalCommits}
Current Streak: ${data.contributions.currentStreak} days
Longest Streak: ${data.contributions.longestStreak} days
Total Stars: ${data.repositories.reduce((sum, r) => sum + (r.stars || 0), 0)}
Total Repos: ${data.repositories.length}
Active Repos: ${data.repositories.filter(r => r.maturityStage === 'active').length}
Languages: ${data.metrics.skills.length}
Documentation: ${data.metrics.documentationHabits}
Consistency: ${data.metrics.consistencyScore}/100
Impact: ${data.metrics.impactScore}/100

AVAILABLE ACHIEVEMENTS:
- streak_master: 30+ day current streak
- rising_star: 100+ total stars
- documentation_hero: Excellent documentation habits
- prolific_builder: 20+ repositories
- quality_craftsman: Average health score > 75
- open_source_champion: Impact score > 70
- specialist: Deep expertise (consistency > 80)
- polyglot: 5+ programming languages
- consistent_contributor: Consistency score > 70
- community_favorite: 500+ total stars
- marathon_coder: 100+ day streak
- early_adopter: Account age > 2 years

TASK: Return JSON array of earned achievement IDs:

["achievement_id_1", "achievement_id_2", ...]

Only include achievements where criteria are clearly met.`;
}

/**
 * Generate skill progression analysis
 */
function getSkillProgressionPrompt(skills, repositories) {
    const skillsData = skills.slice(0, 5).map(s => ({
        name: s.name,
        repos: s.evidenceCount,
        firstUsed: s.firstUsed,
        lastUsed: s.lastUsed
    }));

    return `Analyze this developer's skill progression over time.

TOP SKILLS:
${skillsData.map(s => `- ${s.name}: Used in ${s.repos} repos, First: ${new Date(s.firstUsed).getFullYear()}, Last: ${new Date(s.lastUsed).getFullYear()}`).join('\n')}

TASK: Provide skill progression insights as JSON:

{
  "primarySkill": {
    "name": "Most dominant skill",
    "level": "Beginner/Intermediate/Advanced/Expert",
    "trend": "Growing/Stable/Declining"
  },
  "emergingSkills": ["skill 1", "skill 2"],
  "matureSkills": ["skill 1", "skill 2"],
  "recommendations": "What skills to focus on next (1 sentence)"
}`;
}

/**
 * Generate detailed comparison analysis
 */
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

/**
 * Legacy prompts (simplified versions)
 */
function getRepoSummaryPrompt(repo) {
    return `Summarize this repository in ONE compelling sentence (max 20 words):

Name: ${repo.name}
Description: ${repo.description || 'No description'}
Language: ${repo.language || 'Multiple'}
Stars: ${repo.stars}

Focus on what problem it solves, not the tech stack.`;
}

function getDeveloperInsightPrompt(data) {
    return `Write ONE sentence (max 25 words) capturing this developer's style:

Repos: ${data.repositories.length}
Consistency: ${data.metrics.consistencyScore}/100
Documentation: ${data.metrics.documentationHabits}
Pattern: ${data.metrics.activityPattern}

Be specific and actionable.`;
}

function getActivityNarrativePrompt(contributions, pattern) {
    return `Describe this developer's coding rhythm in 2-3 sentences:

Commits: ${contributions.totalCommits}
Streak: ${contributions.currentStreak} days (longest: ${contributions.longestStreak})
Pattern: ${pattern}`;
}

function getGrowthActionsPrompt(data) {
    return `Suggest 3 specific actions this developer can take THIS WEEK:

Active projects: ${data.repositories.filter(r => r.maturityStage === 'active').length}
Consistency: ${data.metrics.consistencyScore}/100
Documentation: ${data.metrics.documentationHabits}

Return as JSON array: ["action 1", "action 2", "action 3"]`;
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
 * PREMIUM: AI Verdict Prompt (4-sentence narrative)
 */
function getAIVerdictPrompt(data) {
    const username = data.username;
    const repos = data.repositories?.length || 0;
    const stars = data.repositories?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0;
    const commits = data.contributions?.totalCommits || 0;
    const languages = Object.keys(data.metrics?.skills || {}).slice(0, 5).join(', ') || 'N/A';
    const contributions = data.contributions?.totalCommits || 0;
    const longestStreak = data.contributions?.longestStreak || 0;
    const topRepos = (data.repositories || []).slice(0, 3).map(r => r.name).join(', ');
    
    return `You are a senior tech recruiter analyzing developer profiles.

CONTEXT:
- Username: ${username}
- Total Repos: ${repos}
- Stars: ${stars}
- Commits: ${commits}
- Top Languages: ${languages}
- Recent Activity: ${contributions} commits
- Longest Streak: ${longestStreak} days
- Repository Descriptions: ${topRepos}

TASK:
Write a 4-sentence narrative that:
1. Identifies their developer archetype (Builder/Architect/Explorer/Specialist)
2. Highlights their unique strength (consistency/innovation/community/craft)
3. Mentions a surprising insight from their data
4. Ends with a forward-looking statement

TONE: Insightful, respectful, specific (not generic)
FORMAT: Plain text, no bullet points

ARCHETYPES:
- Builder (80%+): Prolific project creation, many practical repos
- Architect (60%+): Few repos but high stars, well-documented
- Explorer (50%+): Diverse languages, experimental projects
- Specialist (70%+): Focused on 1-2 languages/domains

EXAMPLE OUTPUT:
"Lokesh is a prolific Builder (85%) with exceptional project velocity—39 repositories in 2 years. His 30-day commit streak places him in the top 8% for consistency. Notably, his TypeScript adoption has accelerated 40% in the last 6 months, signaling evolution toward scalable architecture. Trajectory suggests potential for tech lead roles within 12-18 months."

Your analysis:`;
}

/**
 * PREMIUM: Growth Opportunities Prompt (3 specific recommendations)
 */
function getGrowthOpportunitiesPrompt(data) {
    const repos = data.repositories?.length || 0;
    const totalStars = data.repositories?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0;
    const totalCommits = data.contributions?.totalCommits || 0;
    const languages = Object.keys(data.metrics?.skills || {}).length || 0;
    const currentStreak = data.contributions?.currentStreak || 0;
    const followers = data.profile?.followers || 0;
    const accountAge = data.profile?.createdAt ? 
        Math.floor((Date.now() - new Date(data.profile.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365)) : 0;
    
    // Calculate documentation quality
    const reposWithReadme = (data.repositories || []).filter(r => r.hasReadme).length;
    const avgReadmeScore = repos > 0 ? Math.round((reposWithReadme / repos) * 100) : 0;
    
    return `You are a senior engineering mentor analyzing a developer's profile.

DEVELOPER PROFILE:
- Repos: ${repos}
- Stars: ${totalStars}
- Commits: ${totalCommits}
- Languages: ${languages}
- Streak: ${currentStreak} days
- Documentation quality: ${avgReadmeScore}/100
- External contributions: 0 (assumed)
- Followers: ${followers}

BENCHMARKS (for developers with ${accountAge} years experience):
- Top 10%: 100+ stars, 50+ repos, 90-day streaks
- Top 25%: 50+ stars, 30+ repos, comprehensive READMEs
- Top 50%: 20+ stars, 20+ repos, consistent activity

TASK:
Identify the 3 highest-leverage growth opportunities. For each:
1. State the gap (specific metric or behavior)
2. Explain why it matters (impact on visibility/skills/career)
3. Give 1-2 actionable steps (concrete, not vague)

FORMAT:
Number each recommendation (1️⃣, 2️⃣, 3️⃣)
Bold the category name
2-3 sentences each

PRIORITIZATION:
Focus on:
- Quick wins (high impact, low effort) first
- Gaps that hold them back from next tier
- Specific to their stack and trajectory

AVOID:
- Generic advice ("learn data structures")
- Obvious tips ("commit more code")
- Unactionable fluff ("be more creative")

Your recommendations:`;
}

/**
 * PREMIUM: Year Wrapped Prompt
 */
function getYearWrappedPrompt(data) {
    const yearlyStats = {
        totalCommits: data.contributions?.totalCommits || 0,
        totalRepos: data.repositories?.length || 0,
        languages: Object.keys(data.metrics?.skills || {}).length || 0
    };
    
    return `Create a "year in review" narrative for this developer:

YEARLY DATA:
${JSON.stringify(yearlyStats)}

COMMIT PATTERNS:
- Total commits: ${yearlyStats.totalCommits}
- Current streak: ${data.contributions?.currentStreak || 0} days
- Longest streak: ${data.contributions?.longestStreak || 0} days

TASKS:
1. Divide the year into 3-4 "chapters" based on activity patterns
2. Give each chapter a creative name and emoji
3. Highlight 2-3 key events per chapter
4. Add personality with "fun stats" (most active hour, day, etc.)
5. End with a forward-looking statement for next year

TONE: Celebratory but honest (acknowledge slow periods)
FORMAT: Markdown with emoji, organized by quarters

CREATIVITY: Use metaphors (explosive start, comeback arc, etc.)

Your year wrapped:`;
}

/**
 * PREMIUM: Repository Storytelling Prompt
 */
function getRepoStorytellingPrompt(repo) {
    return `You're a tech journalist reviewing this repository:

REPO DATA:
- Name: ${repo.name}
- Description: ${repo.description || 'No description'}
- Language: ${repo.language || 'Multiple'}
- Stars: ${repo.stars || 0}
- Forks: ${repo.forks || 0}
- Commits: ${repo.commitCount || 0}
- README quality: ${repo.hasReadme ? 'Good' : 'Poor'}

Write a 2-sentence review that:
1. Explains what makes this project significant
2. Highlights a technical insight (architecture choice, tooling, etc.)

Style: Insightful, specific (not marketing fluff)
No emojis, no hype words like "amazing" or "incredible"

Your review:`;
}

/**
 * PREMIUM: Comparison Verdict Prompt
 */
function getComparisonVerdictPrompt(devA, devB) {
    return `You are an impartial tech industry analyst comparing two developers.

DEVELOPER A:
${JSON.stringify(devA, null, 2)}

DEVELOPER B:
${JSON.stringify(devB, null, 2)}

TASK:
Write a 4-paragraph comparison:

PARAGRAPH 1: Opening statement
- Who are they and what's their primary identity?
- Frame the comparison (apples-to-apples or apples-to-oranges?)

PARAGRAPH 2: Strengths of Developer A
- What are they exceptional at?
- Unique advantages or specializations

PARAGRAPH 3: Strengths of Developer B
- What are they exceptional at?
- Unique advantages or specializations

PARAGRAPH 4: Verdict and context
- Who "wins" depends on context (specify what contexts)
- Acknowledge both as valuable
- If skill gap is massive, be honest but respectful

SPECIAL CASES:
- If both are legends (10K+ stars): Emphasize "both winners"
- If one is clearly far ahead: Acknowledge but don't diminish the other
- If very similar: Focus on subtle differentiators

TONE: Analytical, fair, respectful
AVOID: Declaring absolute winners, putting down anyone
FORMAT: 4 paragraphs, plain text, 150-200 words total

Your comparison:`;
}

module.exports = {
    // Enhanced prompts
    getDeveloperPersonalityPrompt,
    getRepositoryStoryPrompt,
    getGrowthTrajectoryPrompt,
    getAchievementDetectionPrompt,
    getSkillProgressionPrompt,
    getDetailedComparisonPrompt,

    // Premium prompts
    getAIVerdictPrompt,
    getGrowthOpportunitiesPrompt,
    getYearWrappedPrompt,
    getRepoStorytellingPrompt,
    getComparisonVerdictPrompt,

    // Legacy prompts
    getRepoSummaryPrompt,
    getDeveloperInsightPrompt,
    getActivityNarrativePrompt,
    getGrowthActionsPrompt,
    getDeveloperArchetypePrompt
};
