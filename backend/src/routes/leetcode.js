const express = require('express');
const router = express.Router();
const leetCodeController = require('../controllers/leetcodeController');

// POST /api/leetcode/analyze - Analyze LeetCode profile
router.post('/analyze', leetCodeController.analyzeUser);

// GET /api/leetcode/:username - Get cached data
router.get('/:username', leetCodeController.getUser);

module.exports = router;
