const express = require('express');
const router = express.Router();
const comparisonController = require('../controllers/comparisonController');

// POST /api/compare - Compare two GitHub users
router.post('/', comparisonController.compareUsers);

// GET /api/compare/:userA/:userB - Get cached comparison
router.get('/:userA/:userB', comparisonController.getComparison);

module.exports = router;
