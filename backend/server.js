require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 DevIntel API Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API URL: http://localhost:${PORT}`);
    console.log(`💚 Health check: http://localhost:${PORT}/api/health\n`);

    // Keep-Alive Mechanism (Self-Ping)
    // Pings the server every 14 minutes to prevent Render free tier from sleeping (sleeps after 15m inactivity)
    if (process.env.NODE_ENV === 'production') {
        const axios = require('axios');
        const selfUrl = process.env.BACKEND_URL || `http://localhost:${PORT}`; // Better to use env var for public URL

        console.log('⏰ Keep-Alive service started: Pinging every 14 minutes');

        setInterval(async () => {
            try {
                await axios.get(`${selfUrl}/api/health`);
                console.log(`[Keep-Alive] Ping successful at ${new Date().toISOString()}`);
            } catch (error) {
                console.error(`[Keep-Alive] Ping failed: ${error.message}`);
            }
        }, 14 * 60 * 1000); // 14 minutes
    }
});
