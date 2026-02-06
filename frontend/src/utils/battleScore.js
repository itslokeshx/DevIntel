// Calculate overall battle score (0-100)
export function calculateBattleScore(userData) {
    if (!userData) return 0;

    const repos = userData.repositories?.length || 0;
    const stars = userData.repositories?.reduce((sum, r) => sum + (r.stars || 0), 0) || 0;
    const commits = userData.contributions?.totalCommits || 0;
    const streak = userData.contributions?.currentStreak || 0;
    const hasReadme = userData.repositories?.filter(r => r.hasReadme).length || 0;

    // Score breakdown (total 100 points)
    const repoScore = Math.min((repos / 50) * 20, 20); // Max 20 points (50 repos = max)
    const starScore = Math.min((stars / 500) * 25, 25); // Max 25 points (500 stars = max)
    const commitScore = Math.min((commits / 5000) * 25, 25); // Max 25 points (5000 commits = max)
    const consistencyScore = Math.min((streak / 365) * 15, 15); // Max 15 points (365 day streak = max)
    const docsScore = repos > 0 ? (hasReadme / repos) * 15 : 0; // Max 15 points (100% README coverage)

    const totalScore = repoScore + starScore + commitScore + consistencyScore + docsScore;

    return {
        total: Math.round(totalScore),
        breakdown: {
            repos: Math.round(repoScore),
            stars: Math.round(starScore),
            commits: Math.round(commitScore),
            consistency: Math.round(consistencyScore),
            docs: Math.round(docsScore)
        }
    };
}

// Determine battle winner based on overall scores
export function determineBattleWinner(scoreA, scoreB) {
    const diff = Math.abs(scoreA - scoreB);

    if (diff < 5) {
        return {
            winner: 'TIE',
            margin: diff,
            description: 'Evenly Matched'
        };
    }

    const winner = scoreA > scoreB ? 'A' : 'B';
    const margin = Math.max(scoreA, scoreB) - Math.min(scoreA, scoreB);

    let description = 'Victory';
    if (margin >= 30) description = 'Dominant Victory';
    else if (margin >= 15) description = 'Clear Victory';
    else description = 'Close Victory';

    return {
        winner,
        margin,
        description
    };
}
