const axios = require('axios');
const { GITHUB_API_BASE } = require('../../config/constants');

// GitHub API client with authentication
const githubAPI = axios.create({
    baseURL: GITHUB_API_BASE,
    headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
    }
});

/**
 * Fetch user profile from GitHub
 */
async function fetchUserProfile(username) {
    try {
        const response = await githubAPI.get(`/users/${username}`);
        return {
            username: response.data.login,
            name: response.data.name,
            bio: response.data.bio,
            location: response.data.location,
            company: response.data.company,
            blog: response.data.blog,
            htmlUrl: response.data.html_url,
            avatarUrl: response.data.avatar_url,
            followers: response.data.followers,
            following: response.data.following,
            publicRepos: response.data.public_repos,
            createdAt: new Date(response.data.created_at)
        };
    } catch (error) {
        if (error.response && error.response.status === 404) {
            const err = new Error(`GitHub user '${username}' not found`);
            err.statusCode = 404;
            throw err;
        }
        throw error;
    }
}

/**
 * Fetch all repositories for a user (with pagination)
 */
async function fetchUserRepositories(username) {
    try {
        const repos = [];
        let page = 1;
        let hasMore = true;

        while (hasMore && page <= 10) { // Limit to 10 pages (1000 repos max)
            const response = await githubAPI.get(`/users/${username}/repos`, {
                params: {
                    per_page: 100,
                    page,
                    sort: 'updated',
                    direction: 'desc'
                }
            });

            if (response.data.length === 0) {
                hasMore = false;
            } else {
                repos.push(...response.data);
                page++;
            }
        }

        return repos;
    } catch (error) {
        console.error(`Error fetching repos for ${username}:`, error.message);
        throw error;
    }
}

/**
 * Fetch languages for a repository
 */
async function fetchRepoLanguages(owner, repo) {
    try {
        const response = await githubAPI.get(`/repos/${owner}/${repo}/languages`);
        return response.data; // Returns object like {JavaScript: 45000, Python: 23000}
    } catch (error) {
        console.error(`Error fetching languages for ${owner}/${repo}:`, error.message);
        return {};
    }
}

/**
 * Fetch accurate commit count for a repository using GitHub API
 * Optimized for speed - uses Link header when available
 */
async function fetchRepoCommitCount(owner, repo) {
    try {
        // First, try to get commit count using Link header (fastest method)
        const response = await githubAPI.get(`/repos/${owner}/${repo}/commits`, {
            params: {
                per_page: 1,
                page: 1
            }
        });
        
        // Check Link header for total pages
        const linkHeader = response.headers.link;
        if (linkHeader) {
            // Extract last page number from Link header
            const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
            if (lastPageMatch) {
                const lastPage = parseInt(lastPageMatch[1]);
                if (lastPage === 1) {
                    // Only 1 page, return count directly
                    return response.data.length;
                }
                // Get commits from last page to get accurate count
                try {
                    const lastPageResponse = await githubAPI.get(`/repos/${owner}/${repo}/commits`, {
                        params: {
                            per_page: 100,
                            page: lastPage
                        }
                    });
                    const commitsOnLastPage = lastPageResponse.data.length;
                    const totalCommits = (lastPage - 1) * 100 + commitsOnLastPage;
                    return totalCommits;
                } catch (err) {
                    // If last page fails, estimate from first page
                    return lastPage * 100; // Estimate
                }
            }
        }
        
        // If no Link header, try pagination (limited to 3 pages for speed)
        let commitCount = 0;
        let page = 1;
        let hasMore = true;
        
        while (hasMore && page <= 3) { // Limit to 3 pages (300 commits) for performance
            const pageResponse = await githubAPI.get(`/repos/${owner}/${repo}/commits`, {
                params: {
                    per_page: 100,
                    page
                }
            });
            
            if (pageResponse.data.length === 0) {
                hasMore = false;
            } else {
                commitCount += pageResponse.data.length;
                if (pageResponse.data.length < 100) {
                    hasMore = false;
                } else {
                    page++;
                }
            }
        }
        
        // If we got 300 commits, there might be more, but we'll use this as estimate
        return commitCount;
    } catch (error) {
        // Final fallback: return 0 if we can't get commits
        console.error(`Error fetching commits for ${owner}/${repo}:`, error.message);
        return 0;
    }
}

/**
 * Fetch all commits with dates for a repository (for accurate calendar)
 */
async function fetchRepoCommitsWithDates(owner, repo, since = null) {
    try {
        const commits = [];
        let page = 1;
        let hasMore = true;
        const sinceDate = since || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
        
        while (hasMore && page <= 5) { // Limit pages for performance
            const response = await githubAPI.get(`/repos/${owner}/${repo}/commits`, {
                params: {
                    per_page: 100,
                    page,
                    since: sinceDate
                }
            });
            
            if (response.data.length === 0) {
                hasMore = false;
            } else {
                commits.push(...response.data.map(commit => ({
                    date: commit.commit.author.date,
                    count: 1
                })));
                
                if (response.data.length < 100) {
                    hasMore = false;
                } else {
                    page++;
                }
            }
        }
        
        return commits;
    } catch (error) {
        console.error(`Error fetching commits with dates for ${owner}/${repo}:`, error.message);
        return [];
    }
}

/**
 * Fetch README content for a repository
 */
async function fetchRepoReadme(owner, repo) {
    try {
        const response = await githubAPI.get(`/repos/${owner}/${repo}/readme`);

        // README is returned as base64, decode it
        const content = Buffer.from(response.data.content, 'base64').toString('utf-8');

        return {
            hasReadme: true,
            readmeLength: content.length,
            readmeContent: content.substring(0, 1000) // First 1000 chars for AI summary
        };
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return { hasReadme: false, readmeLength: 0, readmeContent: '' };
        }
        console.error(`Error fetching README for ${owner}/${repo}:`, error.message);
        return { hasReadme: false, readmeLength: 0, readmeContent: '' };
    }
}

/**
 * Check GitHub API rate limit
 */
async function checkRateLimit() {
    try {
        const response = await githubAPI.get('/rate_limit');
        return {
            limit: response.data.rate.limit,
            remaining: response.data.rate.remaining,
            reset: new Date(response.data.rate.reset * 1000)
        };
    } catch (error) {
        console.error('Error checking rate limit:', error.message);
        return null;
    }
}

module.exports = {
    fetchUserProfile,
    fetchUserRepositories,
    fetchRepoLanguages,
    fetchRepoCommitCount,
    fetchRepoCommitsWithDates,
    fetchRepoReadme,
    checkRateLimit
};
