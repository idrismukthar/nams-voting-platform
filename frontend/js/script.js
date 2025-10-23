document.addEventListener("DOMContentLoaded", () => {
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
});
