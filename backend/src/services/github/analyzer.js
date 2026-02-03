const {
    calculateRepoHealth,
    determineMaturityStage,
    assessDocumentation,
    calculateDevScore,
    calculateConsistencyScore,
    calculateImpactScore,
    calculateQualityScore,
    calculateSkillLevel,
    detectActivityPattern,
    daysBetween
} = require('../../utils/metrics');

const {
    fetchUserProfile,
    fetchUserRepositories,
    fetchRepoLanguages,
    fetchRepoCommitCount,
    fetchRepoReadme
} = require('./fetcher');

/**
 * Analyze a GitHub user's complete profile
 */
async function analyzeGitHubUser(username) {
    console.log(`Starting analysis for GitHub user: ${username}`);

    // Fetch profile
    const profile = await fetchUserProfile(username);

    // Fetch repositories
    const rawRepos = await fetchUserRepositories(username);
    console.log(`Found ${rawRepos.length} repositories`);

    // Filter out forks (optional - can be configured)
    const ownRepos = rawRepos.filter(repo => !repo.fork);

    // Analyze each repository
    const repositories = await Promise.all(
        ownRepos.slice(0, 50).map(repo => analyzeRepository(username, repo)) // Limit to 50 repos for performance
    );

    // Calculate contribution metrics
    const contributions = calculateContributions(repositories);

    // Infer skills from repositories
    const skills = inferSkills(repositories);

    // Calculate overall metrics
    const consistencyScore = calculateConsistencyScore(contributions);
    const impactScore = calculateImpactScore(repositories);
    const qualityScore = calculateQualityScore(repositories);
    const devScore = calculateDevScore(consistencyScore, impactScore, qualityScore);

    // Determine primary tech identity
    const primaryTechIdentity = determinePrimaryTech(skills, repositories);

    // Detect activity pattern
    const activityPattern = detectActivityPattern(contributions);

    // Determine project focus
    const projectFocus = determineProjectFocus(repositories);

    // Assess documentation habits
    const documentationHabits = assessDocHabits(repositories);

    return {
        profile,
        repositories,
        contributions,
        metrics: {
            devScore,
            consistencyScore,
            impactScore,
            primaryTechIdentity,
            skills,
            activityPattern,
            projectFocus,
            documentationHabits
        }
    };
}

/**
 * Analyze a single repository
 */
async function analyzeRepository(owner, repo) {
    const repoData = {
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        watchers: repo.watchers_count,
        language: repo.language,
        topics: repo.topics || [],
        createdAt: new Date(repo.created_at),
        updatedAt: new Date(repo.updated_at),
        pushedAt: new Date(repo.pushed_at),
        size: repo.size,
        hasLicense: repo.license !== null,
        isArchived: repo.archived,
        isFork: repo.fork
    };

    // Fetch additional data
    try {
        // Get languages
        const languages = await fetchRepoLanguages(owner, repo.name);
        repoData.languages = languages;

        // Get README
        const readmeData = await fetchRepoReadme(owner, repo.name);
        repoData.hasReadme = readmeData.hasReadme;
        repoData.readmeLength = readmeData.readmeLength;
        repoData.readmeContent = readmeData.readmeContent;

        // Get commit count (approximate)
        const commitCount = await fetchRepoCommitCount(owner, repo.name);
        repoData.commitCount = commitCount;

    } catch (error) {
        console.error(`Error analyzing repo ${repo.name}:`, error.message);
    }

    // Calculate computed fields
    repoData.ageInDays = daysBetween(repoData.createdAt, new Date());
    repoData.lastCommitDate = repoData.pushedAt;
    repoData.commitFrequency = determineCommitFrequency(repoData);
    repoData.maturityStage = determineMaturityStage(repoData);
    repoData.documentationQuality = assessDocumentation(repoData);
    repoData.healthScore = calculateRepoHealth(repoData);

    return repoData;
}

/**
 * Calculate contribution metrics from repositories
 */
function calculateContributions(repositories) {
    const totalCommits = repositories.reduce((sum, r) => sum + (r.commitCount || 0), 0);

    // Group commits by month (simplified - based on repo updates)
    const commitsByMonth = groupCommitsByMonth(repositories);

    // Calculate streaks (simplified version)
    const { longestStreak, currentStreak } = calculateStreaks(repositories);

    // Calculate average commits per day
    const oldestRepo = repositories.reduce((oldest, r) =>
        r.createdAt < oldest ? r.createdAt : oldest, new Date()
    );
    const daysSinceStart = daysBetween(oldestRepo, new Date());
    const averageCommitsPerDay = daysSinceStart > 0 ? totalCommits / daysSinceStart : 0;

    // Find inactive gaps
    const inactiveGaps = findInactiveGaps(repositories);

    return {
        totalCommits,
        commitsByMonth,
        longestStreak,
        currentStreak,
        averageCommitsPerDay: parseFloat(averageCommitsPerDay.toFixed(2)),
        busiestDay: 'N/A', // Would need detailed commit data
        busiestMonth: commitsByMonth.length > 0 ? commitsByMonth[0].month : 'N/A',
        inactiveGaps
    };
}

/**
 * Infer skills from repository languages
 */
function inferSkills(repositories) {
    const skillMap = new Map();

    repositories.forEach(repo => {
        if (repo.languages) {
            Object.entries(repo.languages).forEach(([lang, bytes]) => {
                if (!skillMap.has(lang)) {
                    skillMap.set(lang, {
                        name: lang,
                        totalLines: 0,
                        evidenceCount: 0,
                        firstUsed: repo.createdAt,
                        lastUsed: repo.updatedAt
                    });
                }

                const skill = skillMap.get(lang);
                skill.totalLines += bytes;
                skill.evidenceCount += 1;

                if (repo.createdAt < skill.firstUsed) skill.firstUsed = repo.createdAt;
                if (repo.updatedAt > skill.lastUsed) skill.lastUsed = repo.updatedAt;
            });
        }
    });

    // Convert to array and calculate levels
    const skills = Array.from(skillMap.values()).map(skill => {
        const daysSinceUse = daysBetween(skill.lastUsed, new Date());
        skill.level = calculateSkillLevel(skill.totalLines, skill.evidenceCount, daysSinceUse);
        return skill;
    });

    // Sort by total lines (descending)
    return skills.sort((a, b) => b.totalLines - a.totalLines);
}

/**
 * Helper functions
 */

function determineCommitFrequency(repo) {
    const daysSinceUpdate = daysBetween(repo.pushedAt, new Date());
    const commits = repo.commitCount || 0;

    if (commits === 0) return 'none';
    if (daysSinceUpdate < 7 && commits > 10) return 'daily';
    if (daysSinceUpdate < 30 && commits > 5) return 'weekly';
    if (daysSinceUpdate < 90) return 'monthly';
    return 'sporadic';
}

function groupCommitsByMonth(repositories) {
    // Simplified: Use repo update dates as proxy
    const monthMap = new Map();

    repositories.forEach(repo => {
        if (repo.pushedAt) {
            const month = repo.pushedAt.toISOString().substring(0, 7); // YYYY-MM
            monthMap.set(month, (monthMap.get(month) || 0) + (repo.commitCount || 0));
        }
    });

    return Array.from(monthMap.entries())
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => b.count - a.count);
}

function calculateStreaks(repositories) {
    // Simplified streak calculation based on repo activity
    const sortedRepos = repositories
        .filter(r => r.pushedAt)
        .sort((a, b) => b.pushedAt - a.pushedAt);

    let currentStreak = 0;
    let longestStreak = 0;

    sortedRepos.forEach((repo, index) => {
        const daysSinceUpdate = daysBetween(repo.pushedAt, new Date());

        if (daysSinceUpdate < 30) {
            currentStreak = Math.max(currentStreak, 30 - daysSinceUpdate);
        }

        if (index > 0) {
            const daysBetweenRepos = daysBetween(sortedRepos[index - 1].pushedAt, repo.pushedAt);
            if (daysBetweenRepos < 30) {
                longestStreak = Math.max(longestStreak, 30);
            }
        }
    });

    return { longestStreak, currentStreak };
}

function findInactiveGaps(repositories) {
    const gaps = [];
    const sortedRepos = repositories
        .filter(r => r.pushedAt)
        .sort((a, b) => a.pushedAt - b.pushedAt);

    for (let i = 1; i < sortedRepos.length; i++) {
        const daysBetweenUpdates = daysBetween(sortedRepos[i - 1].pushedAt, sortedRepos[i].pushedAt);

        if (daysBetweenUpdates > 60) {
            gaps.push({
                start: sortedRepos[i - 1].pushedAt,
                end: sortedRepos[i].pushedAt,
                durationDays: daysBetweenUpdates
            });
        }
    }

    return gaps;
}

function determinePrimaryTech(skills, repositories) {
    if (skills.length === 0) return 'General Developer';

    const topSkill = skills[0].name;
    const backendLangs = ['Java', 'Python', 'Go', 'Ruby', 'PHP', 'C#', 'Rust'];
    const frontendLangs = ['JavaScript', 'TypeScript', 'HTML', 'CSS'];

    const hasBackend = skills.some(s => backendLangs.includes(s.name));
    const hasFrontend = skills.some(s => frontendLangs.includes(s.name));

    if (hasBackend && hasFrontend) return 'Full-Stack Developer';
    if (hasBackend) return 'Backend Developer';
    if (hasFrontend) return 'Frontend Developer';

    return `${topSkill} Developer`;
}

function determineProjectFocus(repositories) {
    const activeRepos = repositories.filter(r => r.maturityStage === 'active' || r.maturityStage === 'stable');
    const avgCommits = activeRepos.reduce((sum, r) => sum + (r.commitCount || 0), 0) / activeRepos.length;

    if (activeRepos.length <= 5 && avgCommits > 50) return 'deep';
    if (activeRepos.length > 15) return 'broad';
    return 'balanced';
}

function assessDocHabits(repositories) {
    const withDocs = repositories.filter(r => r.documentationQuality !== 'none').length;
    const ratio = withDocs / repositories.length;

    if (ratio > 0.8) return 'excellent';
    if (ratio > 0.5) return 'good';
    if (ratio > 0.2) return 'inconsistent';
    return 'poor';
}

module.exports = {
    analyzeGitHubUser,
    analyzeRepository
};
