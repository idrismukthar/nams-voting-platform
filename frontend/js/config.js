// js/config.js - Production Ready
const SERVER_CONFIG = {
  // For production (Railway)
  url:
    window.location.hostname === "localhost"
      ? "http://localhost:4000"
      : "https://your-railway-app.up.railway.app",

  // For production (Netlify)
  frontend:
    window.location.hostname === "localhost"
      ? "http://localhost:8080"
      : "https://your-netlify-app.netlify.app",
};

// Make it globally available
window.SERVER_CONFIG = SERVER_CONFIG;

console.log(
  "✅ Config loaded - Environment:",
  window.location.hostname === "localhost" ? "Development" : "Production"
);
