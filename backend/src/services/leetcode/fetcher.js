const axios = require('axios');

const LEETCODE_API_URL = 'https://leetcode.com/graphql';

const queries = {
    userProfile: `
        query getUserProfile($username: String!) {
            matchedUser(username: $username) {
                username
                profile {
                    realName
                    userAvatar
                    ranking
                    reputation
                    countryName
                    aboutMe
                    school
                    skillTags
                }
                submitStats {
                    acSubmissionNum {
                        difficulty
                        count
                        submissions
                    }
                    totalSubmissionNum {
                        difficulty
                        count
                        submissions
                    }
                }
                badges {
                    id
                    name
                    shortName
                    displayName
                    icon
                    creationDate
                }
                submissionCalendar
            }
            allQuestionsCount {
                difficulty
                count
            }
        }
    `,
    recentSubmissions: `
        query getRecentSubmissions($username: String!) {
            recentSubmissionList(username: $username, limit: 20) {
                title
                titleSlug
                timestamp
                statusDisplay
                lang
            }
        }
    `
};

exports.fetchLeetCodeData = async (username) => {
    try {
        console.log(`Fetching LeetCode data for: ${username}`);

        // 1. Fetch Profile Data
        const profileResponse = await axios.post(LEETCODE_API_URL, {
            query: queries.userProfile,
            variables: { username }
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        const userData = profileResponse.data?.data?.matchedUser;
        const allQuestions = profileResponse.data?.data?.allQuestionsCount;

        if (!userData) {
            throw new Error(`LeetCode user '${username}' not found`);
        }

        // 2. Fetch Recent Submissions
        const submissionsResponse = await axios.post(LEETCODE_API_URL, {
            query: queries.recentSubmissions,
            variables: { username }
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        const recentSubmissions = submissionsResponse.data?.data?.recentSubmissionList || [];

        // 3. Normalize Data
        return normalizeData(username, userData, allQuestions, recentSubmissions);

    } catch (error) {
        console.error('LeetCode Fetch Error:', error.message);
        throw new Error(`Failed to fetch LeetCode data: ${error.message}`);
    }
};

function normalizeData(username, userData, allQuestions, recentSubmissions) {
    const { profile, submitStats, badges, submissionCalendar } = userData;

    // Calculate totals
    const totalQuestions = allQuestions.find(q => q.difficulty === 'All')?.count || 0;
    const easyTotal = allQuestions.find(q => q.difficulty === 'Easy')?.count || 0;
    const mediumTotal = allQuestions.find(q => q.difficulty === 'Medium')?.count || 0;
    const hardTotal = allQuestions.find(q => q.difficulty === 'Hard')?.count || 0;

    const solved = submitStats.acSubmissionNum;
    const totalSolved = solved.find(s => s.difficulty === 'All')?.count || 0;
    const easySolved = solved.find(s => s.difficulty === 'Easy')?.count || 0;
    const mediumSolved = solved.find(s => s.difficulty === 'Medium')?.count || 0;
    const hardSolved = solved.find(s => s.difficulty === 'Hard')?.count || 0;

    return {
        username: username,
        profile: {
            realName: profile.realName || username,
            avatarUrl: profile.userAvatar,
            ranking: profile.ranking,
            reputation: profile.reputation,
            country: profile.countryName,
            skills: profile.skillTags || [],
            about: profile.aboutMe
        },
        stats: {
            totalSolved,
            easySolved,
            mediumSolved,
            hardSolved,
            acceptanceRate: calculateAcceptanceRate(submitStats),
            totalQuestions,
            easyTotal,
            mediumTotal,
            hardTotal
        },
        submissionCalendar: JSON.parse(submissionCalendar || '{}'),
        badges: badges.map(b => ({
            name: b.displayName,
            icon: b.icon.startsWith('http') ? b.icon : `https://leetcode.com${b.icon}`,
            category: 'LeetCode Badge'
        })),
        recentSubmissions: recentSubmissions.map(sub => ({
            title: sub.title,
            titleSlug: sub.titleSlug,
            timestamp: new Date(parseInt(sub.timestamp) * 1000), // timestamp is unix seconds
            status: sub.statusDisplay,
            lang: sub.lang,
            difficulty: 'Unknown' // Not available in simple recent list, would need deeper query or inference
        }))
    };
}

function calculateAcceptanceRate(submitStats) {
    const totalSubmissions = submitStats.totalSubmissionNum.find(s => s.difficulty === 'All')?.submissions || 0;
    const acSubmissions = submitStats.acSubmissionNum.find(s => s.difficulty === 'All')?.submissions || 0;

    if (totalSubmissions === 0) return 0;
    return parseFloat(((acSubmissions / totalSubmissions) * 100).toFixed(2));
}
