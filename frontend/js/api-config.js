const API_CONFIG = {
  // Change this to your deployed backend URL when deployed
  BASE_URL:
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? "http://localhost:4000"
      : "https://nams-evoting-backend.onrender.com",
};
