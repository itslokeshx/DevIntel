const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');

// POST /api/github/analyze - Analyze a GitHub user
router.post('/analyze', githubController.analyzeUser);

// POST /api/github/ai-verdict - Stream AI verdict
router.post('/ai-verdict', githubController.streamAIVerdict);

// GET /api/github/:username - Get cached GitHub data
router.get('/:username', githubController.getUser);

// POST /api/github/refresh/:username - Force refresh data
router.post('/refresh/:username', githubController.refreshUser);

module.exports = router;
