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
const { getContributionCalendar } = require('./contributionCalendar');

/**
 * Analyze a GitHub user's complete profile
 */
async function analyzeGitHubUser(username) {
    console.log(`Starting analysis for GitHub user: ${username}`);

    // Fetch profile
    const profile = await fetchUserProfile(username);

    // Fetch ALL repositories (no limit)
    const rawRepos = await fetchUserRepositories(username);
    console.log(`Found ${rawRepos.length} repositories`);

    // Filter out forks (optional - can be configured)
    const ownRepos = rawRepos.filter(repo => !repo.fork);
    console.log(`Found ${ownRepos.length} non-fork repositories`);

    // Analyze ALL repositories (not just first 50)
    const repositories = await Promise.all(
        ownRepos.map(repo => analyzeRepository(username, repo))
    );

    // Fetch contribution calendar (if available)
    const contributionCalendar = await getContributionCalendar(username);
    
    // Calculate contribution metrics
    const contributions = calculateContributions(repositories, contributionCalendar);

    // Infer skills from repositories
    const skills = inferSkills(repositories);

    // Calculate language statistics with proper formatting
    const languageStats = calculateLanguageStats(repositories, skills);

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

    // Calculate yearly breakdown with accurate data
    const yearlyBreakdown = calculateYearlyBreakdown(repositories, contributions);

    console.log(`✅ Analysis complete for ${username}:`);
    console.log(`   Total repos: ${repositories.length}`);
    console.log(`   Total commits: ${contributions.totalCommits}`);
    console.log(`   Dev Score: ${devScore}/100`);

    return {
        profile,
        repositories,
        contributions,
        metrics: {
            devScore,
            consistencyScore,
            impactScore,
            qualityScore,
            primaryTechIdentity,
            skills,
            languageStats, // Add properly formatted language stats
            activityPattern,
            projectFocus,
            documentationHabits
        },
        yearlyBreakdown
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
function calculateContributions(repositories, contributionCalendar = null) {
    // Use real calendar data if available
    if (contributionCalendar && contributionCalendar.days) {
        const totalCommits = contributionCalendar.totalContributions || 0;
        
        // Group by month from calendar data
        const commitsByMonth = groupCommitsByMonthFromCalendar(contributionCalendar.days);
        
        // Calculate streaks from calendar
        const { longestStreak, currentStreak } = calculateStreaksFromCalendar(contributionCalendar.days);
        
        return {
            totalCommits,
            commitsByMonth,
            longestStreak,
            currentStreak,
            averageCommitsPerDay: parseFloat((totalCommits / 365).toFixed(2)),
            busiestDay: findBusiestDay(contributionCalendar.days),
            busiestMonth: commitsByMonth.length > 0 ? commitsByMonth[0].month : 'N/A',
            inactiveGaps: [],
            calendar: contributionCalendar.days // Include raw calendar data
        };
    }
    
    // Fallback to repository-based calculation
    const totalCommits = repositories.reduce((sum, r) => sum + (r.commitCount || 0), 0);
    const commitsByMonth = groupCommitsByMonth(repositories);
    const { longestStreak, currentStreak } = calculateStreaks(repositories);
    
    const oldestRepo = repositories.reduce((oldest, r) =>
        r.createdAt < oldest ? r.createdAt : oldest, new Date()
    );
    const daysSinceStart = daysBetween(oldestRepo, new Date());
    const averageCommitsPerDay = daysSinceStart > 0 ? totalCommits / daysSinceStart : 0;
    const inactiveGaps = findInactiveGaps(repositories);

    return {
        totalCommits,
        commitsByMonth,
        longestStreak,
        currentStreak,
        averageCommitsPerDay: parseFloat(averageCommitsPerDay.toFixed(2)),
        busiestDay: 'N/A',
        busiestMonth: commitsByMonth.length > 0 ? commitsByMonth[0].month : 'N/A',
        inactiveGaps
    };
}

function groupCommitsByMonthFromCalendar(days) {
    const monthMap = new Map();
    
    days.forEach(day => {
        const date = new Date(day.date);
        const month = date.toISOString().substring(0, 7); // YYYY-MM
        monthMap.set(month, (monthMap.get(month) || 0) + day.count);
    });
    
    return Array.from(monthMap.entries())
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => b.count - a.count);
}

function calculateStreaksFromCalendar(days) {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Sort by date (newest first)
    const sortedDays = [...days].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedDays.forEach(day => {
        if (day.count > 0) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
            if (currentStreak === 0 || tempStreak === currentStreak + 1) {
                currentStreak = tempStreak;
            }
        } else {
            tempStreak = 0;
        }
    });
    
    return { longestStreak, currentStreak };
}

function findBusiestDay(days) {
    const dayOfWeek = [0, 0, 0, 0, 0, 0, 0]; // Sunday to Saturday
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    days.forEach(day => {
        const date = new Date(day.date);
        dayOfWeek[date.getDay()] += day.count;
    });
    
    const maxIndex = dayOfWeek.indexOf(Math.max(...dayOfWeek));
    return dayNames[maxIndex];
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

/**
 * Calculate language statistics with proper formatting
 */
function calculateLanguageStats(repositories, skills) {
    // Count repos per language
    const langCount = {};
    const langBytes = {};
    
    repositories.forEach(repo => {
        if (repo.language) {
            langCount[repo.language] = (langCount[repo.language] || 0) + 1;
        }
        if (repo.languages) {
            Object.entries(repo.languages).forEach(([lang, bytes]) => {
                langBytes[lang] = (langBytes[lang] || 0) + bytes;
            });
        }
    });
    
    const totalRepos = repositories.length;
    const totalBytes = Object.values(langBytes).reduce((sum, bytes) => sum + bytes, 0);
    
    // Create stats array
    const stats = Object.entries(langCount).map(([name, count]) => {
        const bytes = langBytes[name] || 0;
        const percentage = totalRepos > 0 ? (count / totalRepos) * 100 : 0;
        const bytesPercentage = totalBytes > 0 ? (bytes / totalBytes) * 100 : 0;
        
        return {
            name,
            count,
            repos: count,
            percentage: Math.round(percentage * 10) / 10,
            bytes,
            bytesPercentage: Math.round(bytesPercentage * 10) / 10,
            totalBytes: bytes
        };
    });
    
    return stats.sort((a, b) => b.count - a.count);
}

/**
 * Calculate yearly breakdown with accurate commit data
 */
function calculateYearlyBreakdown(repositories, contributions) {
    const yearMap = {};
    const currentYear = new Date().getFullYear();
    const startYear = currentYear === 2026 ? 2025 : Math.max(currentYear - 3, 2020); // Show last 3-4 years
    
    // Initialize years from startYear to currentYear
    for (let year = startYear; year <= currentYear; year++) {
        yearMap[year] = {
            year,
            repos: 0,
            commits: 0,
            stars: 0,
            topLanguage: null,
            streak: 0,
            monthlyCommits: []
        };
    }
    
    // Aggregate repository data by creation year
    repositories.forEach(repo => {
        const year = repo.createdAt.getFullYear();
        if (yearMap[year]) {
            yearMap[year].repos += 1;
            yearMap[year].stars += (repo.stars || 0);
        }
    });
    
    // Use real calendar data for commits if available
    if (contributions?.calendar && contributions.calendar.length > 0) {
        contributions.calendar.forEach(day => {
            const date = new Date(day.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            
            if (yearMap[year]) {
                yearMap[year].commits += day.count;
                
                // Track monthly commits
                const monthKey = `${year}-${String(month).padStart(2, '0')}`;
                const existingMonth = yearMap[year].monthlyCommits.find(m => m.month === monthKey);
                if (existingMonth) {
                    existingMonth.commits += day.count;
                } else {
                    yearMap[year].monthlyCommits.push({
                        month: monthKey,
                        commits: day.count
                    });
                }
            }
        });
    } else {
        // Fallback: distribute commits from repositories
        repositories.forEach(repo => {
            const year = repo.createdAt.getFullYear();
            if (yearMap[year] && repo.commitCount) {
                yearMap[year].commits += repo.commitCount;
            }
        });
    }
    
    // Find top language per year
    Object.keys(yearMap).forEach(year => {
        const yearRepos = repositories.filter(r => {
            const repoYear = r.createdAt.getFullYear();
            return repoYear === parseInt(year);
        });
        const langCount = {};
        yearRepos.forEach(r => {
            if (r.language) {
                langCount[r.language] = (langCount[r.language] || 0) + 1;
            }
        });
        const topLang = Object.entries(langCount).sort((a, b) => b[1] - a[1])[0];
        yearMap[year].topLanguage = topLang ? topLang[0] : null;
    });
    
    // Calculate streaks per year from calendar data
    if (contributions?.calendar) {
        Object.keys(yearMap).forEach(year => {
            const yearDays = contributions.calendar.filter(d => {
                const dYear = new Date(d.date).getFullYear();
                return dYear === parseInt(year);
            });
            
            if (yearDays.length > 0) {
                let streak = 0;
                let maxStreak = 0;
                let tempStreak = 0;
                
                // Sort by date descending
                const sortedDays = [...yearDays].sort((a, b) => new Date(b.date) - new Date(a.date));
                
                sortedDays.forEach(day => {
                    if (day.count > 0) {
                        tempStreak++;
                        maxStreak = Math.max(maxStreak, tempStreak);
                        if (streak === 0 || tempStreak === streak + 1) {
                            streak = tempStreak;
                        }
                    } else {
                        tempStreak = 0;
                    }
                });
                
                yearMap[year].streak = maxStreak;
            }
        });
    }
    
    // Sort monthly commits
    Object.keys(yearMap).forEach(year => {
        yearMap[year].monthlyCommits.sort((a, b) => a.month.localeCompare(b.month));
    });
    
    return Object.values(yearMap).sort((a, b) => b.year - a.year);
}

module.exports = {
    analyzeGitHubUser,
    analyzeRepository
};
