const axios = require('axios');

/**
 * Fetch contribution calendar using GitHub GraphQL API
 */
async function fetchContributionCalendar(username) {
    try {
        const query = `
            query($username: String!) {
                user(login: $username) {
                    contributionsCollection {
                        contributionCalendar {
                            totalContributions
                            weeks {
                                contributionDays {
                                    date
                                    contributionCount
                                    color
                                }
                            }
                        }
                    }
                }
            }
        `;

        const response = await axios.post(
            'https://api.github.com/graphql',
            {
                query,
                variables: { username }
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.errors) {
            console.error('GraphQL errors:', response.data.errors);
            return null;
        }

        const calendar = response.data.data?.user?.contributionsCollection?.contributionCalendar;
        if (!calendar) {
            return null;
        }

        // Flatten weeks into array of days
        const days = [];
        calendar.weeks.forEach(week => {
            week.contributionDays.forEach(day => {
                days.push({
                    date: day.date,
                    count: day.contributionCount,
                    color: day.color
                });
            });
        });

        return {
            totalContributions: calendar.totalContributions,
            days,
            weeks: calendar.weeks
        };
    } catch (error) {
        console.error('Error fetching contribution calendar:', error.message);
        // Fallback to empty data
        return null;
    }
}

/**
 * Get contribution calendar data (with fallback)
 */
async function getContributionCalendar(username) {
    // Try GraphQL first
    const calendar = await fetchContributionCalendar(username);
    
    if (calendar) {
        return calendar;
    }

    // Fallback: return empty structure
    return {
        totalContributions: 0,
        days: [],
        weeks: []
    };
}

module.exports = {
    fetchContributionCalendar,
    getContributionCalendar
};

