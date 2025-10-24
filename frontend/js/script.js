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

  const apiUrl = "https://notionridesbackend.onrender.com/api/voter/signup/";

  // 🔹 Utility function: Show message feedback
  const showMessage = (message, type = "info") => {
    msgBox.textContent = message;
    msgBox.className = `msg ${type}`; // 'msg success', 'msg error', etc.
    msgBox.style.display = "block";
  };

  // 🔹 Handle Form Submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const full_name = document.getElementById("name").value.trim();
    const matric_no = document.getElementById("matric-no").value.trim();
    const password = document.getElementById("password").value.trim();

    msgBox.style.display = "none"; // Hide old messages

    // ✅ Client-side validation
    if (!full_name || !matric_no || !password) {
      return showMessage("⚠️ Please fill in all fields.", "error");
    }

    if (password.length < 6) {
      return showMessage("⚠️ Password must be at least 6 characters.", "error");
    }

    // Loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Registering...";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, matric_no, password }),
      });

      const data = await response.json().catch(() => ({
        error: "Unexpected server response.",
      }));

      if (response.ok) {
        // ✅ Success feedback
        showMessage("✅ Registration successful!", "success");

        // Save user locally (optional)
        localStorage.setItem(
          "voter_user",
          JSON.stringify({
            full_name,
            matric_no,
          })
        );

        // Redirect after 1.5 seconds
        setTimeout(() => (window.location.href = "ballot.html"), 1500);
      } else {
        // 💬 Handle backend validation feedback
        if (data.matric_no) {
          showMessage(`❌ ${data.matric_no.join(" ")}`, "error");
        } else if (data.error) {
          showMessage(`❌ ${data.error}`, "error");
        } else {
          showMessage("❌ Registration failed. Please try again.", "error");
        }
      }
    } catch (err) {
      console.error("⚠️ Network Error:", err);
      showMessage(
        "❌ Unable to connect to backend. Please ensure the server is running or check your internet.",
        "error"
      );
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.textContent = "Register";
    }
  });
});
