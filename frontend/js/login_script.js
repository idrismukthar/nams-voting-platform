document.addEventListener("DOMContentLoaded", () => {
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
});
