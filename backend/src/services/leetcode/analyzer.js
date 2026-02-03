const { generateContent } = require('../ai/gemini');

exports.analyzeLeetCodeProfile = async (data) => {
    try {
        const prompt = `Analyze this LeetCode profile for a developer:

User: ${data.profile.realName || data.username}
Ranking: ${data.profile.ranking}
Reputation: ${data.profile.reputation}

Problem Solving Stats:
- Total Solved: ${data.stats.totalSolved} / ${data.stats.totalQuestions}
- Easy: ${data.stats.easySolved} (${data.stats.easyTotal})
- Medium: ${data.stats.mediumSolved} (${data.stats.mediumTotal})
- Hard: ${data.stats.hardSolved} (${data.stats.hardTotal})
- Acceptance Rate: ${data.stats.acceptanceRate}%

Badges: ${data.badges.map(b => b.name).join(', ')}

Recent Activity: ${data.recentSubmissions.length} submissions in last 20 queries.

Provide a JSON analyze with the following fields:
1. "verdict": One short sentence summary of their skill level.
2. "strengths": Array of 3 key strengths (e.g. "Consistent Practice", "Algorithms", "Hard Problems").
3. "weaknesses": Array of 2 areas needed improvement (e.g. "Low Hard count", "Inconsistent").
4. "recommendedFocus": One sentence on what they should practice next.
5. "developerType": A 2-word archetype (e.g. "Algorithm Beast", "Casual Solver", "Interview Prepper").

Return ONLY the JSON.`;

        const response = await generateContent(prompt);
        // Try to parse JSON from response (Gemini might return markdown code block)
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        throw new Error('Failed to parse AI response');

    } catch (error) {
        console.error('AI Analysis Error:', error);
        // Fallback
        return {
            verdict: "Active LeetCode user developing problem solving skills.",
            strengths: ["Problem Solving", "Consistency"],
            weaknesses: ["Advanced Algorithms"],
            recommendedFocus: "Practice more medium/hard problems.",
            developerType: "Aspiring Engineer"
        };
    }
};
