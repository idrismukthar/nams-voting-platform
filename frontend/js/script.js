/* document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registration-form");
  const msgBox = document.getElementById("form-message");
  const submitBtn = form.querySelector("button[type='submit']");

  const BASE_URL = "http://localhost:4000"; // Local only

  const showMessage = (message, type = "info") => {
    msgBox.textContent = message;
    msgBox.className = type; // resets and sets class
    msgBox.style.display = "block";
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("name").value.trim();
    const matric = document.getElementById("matric-no").value.trim();
    const password = document.getElementById("password").value.trim();

    msgBox.style.display = "none"; // reset before new message

    // ✅ Validation
    if (!fullname || !matric || !password) {
      showMessage("⚠️ Please fill in all fields.", "error");
      return;
    }

    if (password.length < 6) {
      showMessage("⚠️ Password must be at least 6 characters.", "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Registering...";

    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, matric, password }),
      });

      const data = await res.json().catch(() => ({
        error: "Unexpected server response.",
      }));

      if (res.ok) {
        showMessage(data.message || "✅ Registration successful!", "success");

        // Store session data
        localStorage.setItem(
          "nams_user",
          JSON.stringify({
            fullname: data.fullname || fullname,
            matric,
          })
        );

        // Redirect after delay
        setTimeout(() => {
          window.location.href = "ballot.html";
        }, 1500);
      } else {
        // 💬 Custom feedback for duplicate users
        if (data.error && data.error.toLowerCase().includes("already")) {
          showMessage(
            "⚠️ This matric number is already registered. Please log in instead.",
            "error"
          );
        } else {
          showMessage(data.error || "❌ Registration failed.", "error");
        }
      }
    } catch (err) {
      console.error("⚠️ Network Error:", err);
      showMessage(
        "❌ Unable to connect to backend. Please ensure the server is running.",
        "error"
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Register";
    }
  });
}); */




document.addEventListener("DOMContentLoaded", () => {
  // 🔹 DOM Elements
  const form = document.getElementById("registration-form");
  const msgBox = document.getElementById("form-message");
  const submitBtn = form.querySelector("button[type='submit']");

  // ✅ Updated backend base URL
  const BASE_URL = "https://nams-voting-platform.onrender.com";

  // 🔹 Utility: show message box feedback
  const showMessage = (message, type = "info") => {
    msgBox.textContent = message;
    msgBox.className = `msg ${type}`; // e.g. 'msg success', 'msg error'
    msgBox.style.display = "block";
  };

  // 🔹 Handle Form Submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const full_name = document.getElementById("name").value.trim();
    const matric_no = document.getElementById("matric-no").value.trim();
    const password = document.getElementById("password").value.trim();

    msgBox.style.display = "none"; // Hide previous messages

    // ✅ Client-side validation
    if (!full_name || !matric_no || !password) {
      return showMessage("⚠️ Please fill in all fields.", "error");
    }

    if (password.length < 6) {
      return showMessage("⚠️ Password must be at least 6 characters.", "error");
    }

    // 🌀 Loading state for UX
    submitBtn.disabled = true;
    submitBtn.textContent = "Registering...";

    try {
      // 🔹 Step 1: Register voter
      const signupRes = await fetch(`${BASE_URL}/api/voter/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, matric_no, password }),
      });

      const signupData = await signupRes.json().catch(() => ({
        error: "Unexpected server response.",
      }));

      if (signupRes.ok) {
        showMessage("✅ Registration successful! Logging you in...", "success");

        // 🔹 Step 2: Auto-authenticate using SimpleJWT endpoint
        const loginRes = await fetch(`${BASE_URL}/api/token/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: matric_no, // ✅ backend uses matric_no as username
            password,
          }),
        });

        const loginData = await loginRes.json();

        if (loginRes.ok) {
          // ✅ Save tokens and user data to local storage
          localStorage.setItem("access_token", loginData.access);
          localStorage.setItem("refresh_token", loginData.refresh);
          localStorage.setItem(
            "voter_user",
            JSON.stringify({ full_name, matric_no })
          );

          // ✅ Redirect to ballot page after successful login
          setTimeout(() => {
            window.location.href = "ballot.html";
          }, 1500);
        } else {
          // ⚠️ If login failed but signup succeeded
          showMessage(
            "⚠️ Registered successfully, but login failed. Please log in manually.",
            "error"
          );
        }
      } else {
        // 💬 Handle signup errors from backend
        if (signupData.matric_no) {
          showMessage(`❌ ${signupData.matric_no.join(" ")}`, "error");
        } else if (signupData.error) {
          showMessage(`❌ ${signupData.error}`, "error");
        } else {
          showMessage("❌ Registration failed. Please try again.", "error");
        }
      }
    } catch (err) {
      console.error("⚠️ Network Error:", err);
      showMessage(
        "❌ Unable to connect to the server. Please check your internet or server status.",
        "error"
      );
    } finally {
      // 🔹 Reset button state
      submitBtn.disabled = false;
      submitBtn.textContent = "Register";
    }
  });
});
