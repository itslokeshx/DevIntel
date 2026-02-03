const express = require('express');
const router = express.Router();

// Import route modules
const githubRoutes = require('./github');
const comparisonRoutes = require('./comparison');

// Mount routes
router.use('/github', githubRoutes);
router.use('/compare', comparisonRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'DevIntel API is running',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
