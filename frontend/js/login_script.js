/*document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const msgBox = document.getElementById("loginMessage");
  const submitBtn = form.querySelector("button[type='submit']");

  const BASE_URL = "http://localhost:4000"; // Local only for testing

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const matric = document.getElementById("matric").value.trim();
    const password = document.getElementById("password").value.trim();

    msgBox.textContent = "";
    msgBox.classList.remove("error", "success");

    // Validate
    if (!matric || !password) {
      msgBox.textContent = "⚠️ Please fill in all fields.";
      msgBox.classList.add("error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in...";

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matric, password }),
      });

      const data = await res.json().catch(() => ({
        error: "Unexpected server response.",
      }));

      if (res.ok) {
        msgBox.textContent = data.message || "✅ Login successful!";
        msgBox.classList.add("success");

        localStorage.setItem(
          "nams_user",
          JSON.stringify({ fullname: data.fullname, matric: data.matric })
        );

        setTimeout(() => {
          window.location.href = "ballot.html";
        }, 1200);
      } else {
        msgBox.textContent = data.error || "❌ Login failed. Please try again.";
        msgBox.classList.add("error");
      }
    } catch (err) {
      console.error("⚠️ Network error:", err);
      msgBox.textContent = "❌ Unable to connect to backend.";
      msgBox.classList.add("error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Proceed to Vote";
    }
  });
});*/

document.addEventListener("DOMContentLoaded", () => {
  // 🔹 DOM Elements
  const form = document.getElementById("loginForm");
  const msgBox = document.getElementById("loginMessage");
  const submitBtn = form.querySelector("button[type='submit']");

  // 🔹 Live backend API endpoint
  const BASE_URL = "https://nams-voting-platform.onrender.com/api/login/";

  // 🔹 Utility: Display message feedback
  const showMessage = (message, type = "info") => {
    msgBox.textContent = message;
    msgBox.className = `msg ${type}`; // e.g., 'msg success', 'msg error'
    msgBox.style.display = "block";
  };

  // 🔹 Handle Form Submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Fetch input values
    const username = document.getElementById("matric").value.trim(); // Use matric as username
    const password = document.getElementById("password").value.trim();

    msgBox.style.display = "none"; // Hide previous messages

    // ✅ Client-side validation
    if (!username || !password) {
      return showMessage("⚠️ Please fill in all fields.", "error");
    }

    // Set button to loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in...";

    try {
      // 🔹 Send login request
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      // Parse backend response safely
      const data = await response.json().catch(() => ({
        error: "Unexpected server response.",
      }));

      if (response.ok) {
        // ✅ Login successful
        showMessage("✅ Login successful! Redirecting...", "success");

        // Save voter details locally
        localStorage.setItem(
          "voter_user",
          JSON.stringify({
            username,
            full_name: data.full_name || "", // Optional if backend returns it
            token: data.access || "", // JWT if available
          })
        );

        // Redirect to ballot page after short delay
        setTimeout(() => (window.location.href = "ballot.html"), 1200);
      } else {
        // 💬 Handle backend validation errors
        if (data.detail) {
          showMessage(`❌ ${data.detail}`, "error");
        } else if (data.error) {
          showMessage(`❌ ${data.error}`, "error");
        } else {
          showMessage("❌ Invalid matric number or password.", "error");
        }
      }
    } catch (err) {
      console.error("⚠️ Network Error:", err);
      showMessage(
        "❌ Unable to connect to the server. Please check your internet connection or try again later.",
        "error"
      );
    } finally {
      // Reset button
      submitBtn.disabled = false;
      submitBtn.textContent = "Proceed to Vote";
    }
  });
});
