const LeetCodeData = require('../models/LeetCodeData');
const { fetchLeetCodeData } = require('../services/leetcode/fetcher');
const { analyzeLeetCodeProfile } = require('../services/leetcode/analyzer');

// Analyze a LeetCode user
exports.analyzeUser = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({
                success: false,
                error: { message: 'LeetCode username is required' }
            });
        }

        console.log(`Analyzing LeetCode user: ${username}`);

        // 1. Fetch data from LeetCode
        const rawData = await fetchLeetCodeData(username);

        // 2. Generate AI Insights
        const aiInsights = await analyzeLeetCodeProfile(rawData);

        // 3. Save to Database
        const leetCodeData = await LeetCodeData.findOneAndUpdate(
            { username: rawData.username },
            {
                ...rawData,
                aiInsights,
                updatedAt: new Date(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
            },
            { upsert: true, new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: leetCodeData
        });

    } catch (error) {
        console.error('LeetCode Analysis Error:', error);
        res.status(500).json({
            success: false,
            error: { message: error.message || 'Failed to analyze LeetCode profile' }
        });
    }
};

// Get cached LeetCode data
exports.getUser = async (req, res) => {
    try {
        const { username } = req.params;

        const data = await LeetCodeData.findOne({ username });

        if (!data) {
            return res.status(404).json({
                success: false,
                error: { message: 'No data found. Please analyze first.' }
            });
        }

        res.json({
            success: true,
            data
        });

    } catch (error) {
        console.error('LeetCode Fetch Error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch LeetCode data' }
        });
    }
};
