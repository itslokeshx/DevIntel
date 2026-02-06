/**
 * Keep-Alive Service for Render.com
 * Pings the server every 14 minutes to prevent it from sleeping
 * Note: This only works if you have this running somewhere (like on Vercel/Netlify)
 */

const https = require("https");

const BACKEND_URL =
  process.env.BACKEND_URL || "https://devintel-backend.onrender.com";
const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds

function pingServer() {
  const url = `${BACKEND_URL}/api/health`;

  https
    .get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log(
          `[${new Date().toISOString()}] Ping successful: ${res.statusCode}`,
        );
        console.log("Response:", data);
      });
    })
    .on("error", (err) => {
      console.error(`[${new Date().toISOString()}] Ping failed:`, err.message);
    });
}

// Ping immediately on start
console.log(
  `Keep-Alive Service Started - Pinging ${BACKEND_URL} every 14 minutes`,
);
pingServer();

// Then ping every 14 minutes
setInterval(pingServer, PING_INTERVAL);
