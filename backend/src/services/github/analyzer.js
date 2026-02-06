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
const { validateMetrics, validateYearBreakdown } = require('../../utils/dataValidator');

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

    // Analyze ALL repositories (with batching to avoid rate limits)
    console.log(`📦 Analyzing ${ownRepos.length} repositories...`);

    // Process repositories in batches to avoid overwhelming the API
    const batchSize = 10;
    const repositories = [];

    for (let i = 0; i < ownRepos.length; i += batchSize) {
        const batch = ownRepos.slice(i, i + batchSize);
        console.log(`   Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(ownRepos.length / batchSize)}...`);

        const batchResults = await Promise.all(
            batch.map(async (repo) => {
                try {
                    const analyzed = await analyzeRepository(username, repo);
                    console.log(`   ✅ ${repo.name}: ${analyzed.commitCount || 0} commits`);
                    return analyzed;
                } catch (error) {
                    console.error(`   ❌ Error analyzing repo ${repo.name}:`, error.message);
                    // Return basic repo data even if analysis fails
                    return {
                        name: repo.name,
                        description: repo.description,
                        url: repo.html_url,
                        stars: repo.stargazers_count,
                        forks: repo.forks_count,
                        language: repo.language,
                        createdAt: new Date(repo.created_at),
                        updatedAt: new Date(repo.updated_at),
                        pushedAt: new Date(repo.pushed_at),
                        commitCount: 0,
                        hasReadme: false
                    };
                }
            })
        );

        repositories.push(...batchResults);

        // Small delay between batches to avoid rate limiting
        if (i + batchSize < ownRepos.length) {
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    const totalCommits = repositories.reduce((sum, r) => sum + (r.commitCount || 0), 0);
    console.log(`✅ Analyzed ${repositories.length} repositories, total commits: ${totalCommits}`);

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

    const analysisResult = {
        username,
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
            languageStats,
            activityPattern,
            projectFocus,
            documentationHabits
        },
        yearlyBreakdown
    };

    // Validate data before returning
    const validation = validateMetrics(analysisResult);
    if (!validation.valid) {
        console.error('❌ Data validation failed:', validation.errors);
        console.warn('⚠️ Returning sanitized data');
    }

    // Validate year breakdown
    const yearValidation = validateYearBreakdown(yearlyBreakdown);
    if (!yearValidation.valid) {
        console.error('❌ Year breakdown validation failed:', yearValidation.errors);
    }

    return validation.sanitized;
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
    console.log('📊 Calculating contributions...');
    console.log('   Calendar data available:', contributionCalendar ? 'Yes' : 'No');
    console.log('   Calendar days count:', contributionCalendar?.days?.length || 0);
    console.log('   Calendar total:', contributionCalendar?.totalContributions || 0);

    // Calculate repository-based commits first (always do this as fallback)
    const repoCommits = repositories.reduce((sum, r) => sum + (r.commitCount || 0), 0);
    console.log('   Total commits from repos:', repoCommits);

    // Use real calendar data if available and has meaningful data
    if (contributionCalendar && contributionCalendar.days && contributionCalendar.days.length > 0 && contributionCalendar.totalContributions > 0) {
        const totalCommits = contributionCalendar.totalContributions;
        console.log('✅ Using calendar data, total commits:', totalCommits);

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

    // Fallback to repository-based calculation (CRITICAL: Use repo data when calendar fails)
    console.log('⚠️ Using repository-based calculation as fallback');
    console.log('   Repository commit sum:', repoCommits);

    const totalCommits = repoCommits;
    const commitsByMonth = groupCommitsByMonth(repositories);
    const { longestStreak, currentStreak } = calculateStreaks(repositories);

    const oldestRepo = repositories.length > 0
        ? repositories.reduce((oldest, r) => r.createdAt < oldest ? r.createdAt : oldest, repositories[0].createdAt)
        : new Date();
    const daysSinceStart = daysBetween(oldestRepo, new Date());
    const averageCommitsPerDay = daysSinceStart > 0 ? totalCommits / daysSinceStart : 0;
    const inactiveGaps = findInactiveGaps(repositories);

    console.log('   Final total commits:', totalCommits);
    console.log('   Current streak:', currentStreak);
    console.log('   Longest streak:', longestStreak);

    return {
        totalCommits,
        commitsByMonth,
        longestStreak,
        currentStreak,
        averageCommitsPerDay: parseFloat(averageCommitsPerDay.toFixed(2)),
        busiestDay: 'N/A',
        busiestMonth: commitsByMonth.length > 0 ? commitsByMonth[0].month : 'N/A',
        inactiveGaps,
        calendar: [] // Empty calendar for fallback
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
    if (!days || days.length === 0) {
        return { longestStreak: 0, currentStreak: 0 };
    }

    // Sort by date (newest first)
    const sortedDays = [...days].sort((a, b) => new Date(b.date) - new Date(a.date));

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate current streak (consecutive days from today backwards)
    let expectedDate = today;
    for (let i = 0; i < sortedDays.length; i++) {
        const day = sortedDays[i];
        const dayDate = new Date(day.date);
        dayDate.setHours(0, 0, 0, 0);

        // Check if this day matches expected date (consecutive)
        const daysDiff = Math.floor((expectedDate.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 0 && day.count > 0) {
            // This is the expected day and has commits
            currentStreak++;
            expectedDate = new Date(dayDate);
            expectedDate.setDate(expectedDate.getDate() - 1);
        } else if (daysDiff > 0) {
            // Gap found, streak broken
            break;
        } else if (daysDiff < 0) {
            // This day is in the future, skip
            continue;
        }
    }

    // Calculate longest streak across all days
    tempStreak = 0;
    let prevDate = null;
    sortedDays.forEach(day => {
        const dayDate = new Date(day.date);
        dayDate.setHours(0, 0, 0, 0);

        if (day.count > 0) {
            if (prevDate && Math.floor((prevDate.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24)) === 1) {
                // Consecutive day
                tempStreak++;
            } else {
                tempStreak = 1;
            }
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
        prevDate = dayDate;
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
    // Better streak calculation based on repo activity
    const sortedRepos = repositories
        .filter(r => r.pushedAt)
        .sort((a, b) => b.pushedAt - a.pushedAt);

    if (sortedRepos.length === 0) {
        return { longestStreak: 0, currentStreak: 0 };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate current streak (days since last commit)
    const mostRecentRepo = sortedRepos[0];
    const daysSinceLastCommit = daysBetween(mostRecentRepo.pushedAt, today);

    if (daysSinceLastCommit <= 1) {
        // Had commits today or yesterday, start counting
        currentStreak = 1;
        let expectedDate = new Date(mostRecentRepo.pushedAt);
        expectedDate.setHours(0, 0, 0, 0);
        expectedDate.setDate(expectedDate.getDate() - 1);

        // Count backwards for consecutive days
        for (let i = 1; i < sortedRepos.length; i++) {
            const repo = sortedRepos[i];
            const repoDate = new Date(repo.pushedAt);
            repoDate.setHours(0, 0, 0, 0);

            const daysDiff = Math.floor((expectedDate.getTime() - repoDate.getTime()) / (1000 * 60 * 60 * 24));
            if (daysDiff === 0) {
                currentStreak++;
                expectedDate.setDate(expectedDate.getDate() - 1);
            } else if (daysDiff > 0) {
                break; // Gap found
            }
        }
    }

    // Calculate longest streak
    let prevDate = null;
    sortedRepos.forEach(repo => {
        const repoDate = new Date(repo.pushedAt);
        repoDate.setHours(0, 0, 0, 0);

        if (prevDate) {
            const daysDiff = Math.floor((prevDate.getTime() - repoDate.getTime()) / (1000 * 60 * 60 * 24));
            if (daysDiff <= 1) {
                tempStreak++;
            } else {
                tempStreak = 1;
            }
        } else {
            tempStreak = 1;
        }

        longestStreak = Math.max(longestStreak, tempStreak);
        prevDate = repoDate;
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

    // Create stats array with validation
    const stats = Object.entries(langCount)
        .map(([name, count]) => {
            const bytes = langBytes[name] || 0;
            const percentage = totalRepos > 0 ? (count / totalRepos) * 100 : 0;
            const bytesPercentage = totalBytes > 0 ? (bytes / totalBytes) * 100 : 0;

            // Validate to prevent NaN
            if (isNaN(percentage) || isNaN(bytesPercentage) || !name) {
                console.warn(`[Language Stats] Invalid entry detected:`, { name, count, bytes, percentage, bytesPercentage });
                return null;
            }

            return {
                name,
                count,
                repos: count,
                percentage: Math.round(percentage * 10) / 10,
                bytes,
                bytesPercentage: Math.round(bytesPercentage * 10) / 10,
                totalBytes: bytes
            };
        })
        .filter(stat => stat !== null); // Remove invalid entries

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
