const axios = require('axios');

/**
 * Fetch contribution calendar using GitHub GraphQL API (100% accurate)
 */
async function fetchContributionCalendar(username) {
    try {
        // Get current year and previous year for accurate data
        const currentYear = new Date().getFullYear();
        const startYear = currentYear === 2026 ? 2025 : currentYear - 1;
        const endYear = currentYear;
        
        // Use variables in GraphQL query for better error handling
        const query = `
            query($username: String!, $from: DateTime!, $to: DateTime!) {
                user(login: $username) {
                    contributionsCollection(from: $from, to: $to) {
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
        
        const variables = {
            username: username,
            from: `${startYear}-01-01T00:00:00Z`,
            to: `${endYear}-12-31T23:59:59Z`
        };

        const response = await axios.post(
            'https://api.github.com/graphql',
            {
                query,
                variables
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                timeout: 15000
            }
        );

        if (response.data.errors) {
            console.error('GraphQL errors:', response.data.errors);
            return null;
        }

        const calendar = response.data.data?.user?.contributionsCollection?.contributionCalendar;
        if (!calendar) {
            console.log('No calendar data found for user:', username);
            return null;
        }

        // Flatten weeks into array of days with accurate dates
        const days = [];
        if (calendar.weeks && Array.isArray(calendar.weeks)) {
            calendar.weeks.forEach(week => {
                if (week.contributionDays && Array.isArray(week.contributionDays)) {
                    week.contributionDays.forEach(day => {
                        if (day && day.date) {
                            days.push({
                                date: day.date,
                                count: day.contributionCount || 0,
                                color: day.color
                            });
                        }
                    });
                }
            });
        }

        // Sort by date to ensure chronological order
        days.sort((a, b) => new Date(a.date) - new Date(b.date));

        return {
            totalContributions: calendar.totalContributions || 0,
            days,
            weeks: calendar.weeks
        };
    } catch (error) {
        console.error('Error fetching contribution calendar:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
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

