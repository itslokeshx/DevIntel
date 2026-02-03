const express = require('express');
const cors = require('cors');
const apiLimiter = require('./middleware/rateLimit');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to DevIntel API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            analyzeGitHub: 'POST /api/github/analyze',
            getGitHub: 'GET /api/github/:username',
            refreshGitHub: 'POST /api/github/refresh/:username',
            compare: 'POST /api/compare',
            getComparison: 'GET /api/compare/:userA/:userB'
        }
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
