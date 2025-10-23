// js/admin.js

// js/admin.js - ADD AT THE VERY TOP
document.addEventListener("DOMContentLoaded", () => {
  const ADMIN_PASSWORD = "nams123"; // Your admin password
  const passwordModal = document.getElementById("passwordModal");
  const adminContainer = document.querySelector(".admin-container");

  // Check if already authenticated
  if (localStorage.getItem("adminAuthenticated") === "true") {
    passwordModal.style.display = "none";
    adminContainer.classList.remove("hidden");
    initializeAdminPanel();
  } else {
    passwordModal.style.display = "flex";
    adminContainer.classList.add("hidden");
  }

  // Password input enter key support
  document
    .getElementById("adminPassword")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        checkPassword();
      }
    });
});

// Password check function
function checkPassword() {
  const passwordInput = document.getElementById("adminPassword");
  const passwordMessage = document.getElementById("passwordMessage");
  const passwordModal = document.getElementById("passwordModal");
  const adminContainer = document.querySelector(".admin-container");

  const enteredPassword = passwordInput.value.trim();

  if (enteredPassword === "nams123") {
    // Correct password
    localStorage.setItem("adminAuthenticated", "true");
    passwordModal.style.display = "none";
    adminContainer.classList.remove("hidden");
    initializeAdminPanel();
  } else {
    // Wrong password
    passwordMessage.textContent = "❌ Incorrect password. Please try again.";
    passwordMessage.className = "message-box error";
    passwordMessage.style.display = "block";
    passwordInput.value = "";
    passwordInput.focus();

    // Shake animation for wrong password
    passwordInput.style.animation = "shake 0.5s ease-in-out";
    setTimeout(() => {
      passwordInput.style.animation = "";
    }, 500);
  }
}

// Move all your existing admin code into this function
function initializeAdminPanel() {
  const form = document.getElementById("candidateForm");
  const messageBox = document.getElementById("message");
  const candidatesList = document.getElementById("candidatesList");
  const positionSelect = document.getElementById("position");
  const customPositionGroup = document.getElementById("customPositionGroup");
  const customPositionInput = document.getElementById("customPosition");

  const BASE_URL = "http://localhost:4000";

  // ==================== TOGGLE CUSTOM POSITION FIELD ====================
  positionSelect.addEventListener("change", function () {
    if (this.value === "Others") {
      customPositionGroup.style.display = "block";
      customPositionInput.required = true;
    } else {
      customPositionGroup.style.display = "none";
      customPositionInput.required = false;
      customPositionInput.value = "";
    }
  });

  // ==================== LOAD EXISTING CANDIDATES ====================
  async function loadCandidates() {
    try {
      candidatesList.innerHTML =
        '<div class="loading-text">Loading candidates...</div>';

      const response = await fetch(`${BASE_URL}/candidates`);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const candidates = await response.json();

      if (candidates.length === 0) {
        candidatesList.innerHTML =
          '<div class="no-candidates">No candidates added yet.</div>';
        return;
      }

      displayCandidates(candidates);
    } catch (error) {
      console.error("❌ Error loading candidates:", error);
      candidatesList.innerHTML = `
        <div class="error-message">
          <p>❌ Failed to load candidates</p>
          <p style="font-size: 0.9rem;">${error.message}</p>
          <button onclick="loadCandidates()" class="retry-btn">Retry</button>
        </div>
      `;
    }
  }

  // ==================== DISPLAY CANDIDATES ====================
  function displayCandidates(candidates) {
    // ... (rest of your existing displayCandidates function)
  }

  // ==================== ADD NEW CANDIDATE ====================
  form.addEventListener("submit", async (e) => {
    // ... (rest of your existing form submit code)
  });

  // ==================== DELETE CANDIDATE ====================
  async function deleteCandidate(e) {
    // ... (rest of your existing deleteCandidate function)
  }

  // ==================== HELPER FUNCTIONS ====================
  function showMessage(message, type) {
    // ... (rest of your existing showMessage function)
  }

  // ==================== INITIAL LOAD ====================
  loadCandidates();
}

// Add shake animation to CSS
const style = document.createElement("style");
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  .hidden {
    display: none !important;
  }
`;
document.head.appendChild(style);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("candidateForm");
  const messageBox = document.getElementById("message");
  const candidatesList = document.getElementById("candidatesList");
  const positionSelect = document.getElementById("position");
  const customPositionGroup = document.getElementById("customPositionGroup");
  const customPositionInput = document.getElementById("customPosition");

  const BASE_URL = "http://localhost:4000";

  // ==================== TOGGLE CUSTOM POSITION FIELD ====================
  positionSelect.addEventListener("change", function () {
    if (this.value === "Others") {
      customPositionGroup.style.display = "block";
      customPositionInput.required = true;
    } else {
      customPositionGroup.style.display = "none";
      customPositionInput.required = false;
      customPositionInput.value = "";
    }
  });

  // ==================== LOAD EXISTING CANDIDATES ====================
  async function loadCandidates() {
    try {
      candidatesList.innerHTML =
        '<div class="loading-text">Loading candidates...</div>';

      const response = await fetch(`${BASE_URL}/candidates`);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const candidates = await response.json();

      if (candidates.length === 0) {
        candidatesList.innerHTML =
          '<div class="no-candidates">No candidates added yet.</div>';
        return;
      }

      displayCandidates(candidates);
    } catch (error) {
      console.error("❌ Error loading candidates:", error);
      candidatesList.innerHTML = `
        <div class="error-message">
          <p>❌ Failed to load candidates</p>
          <p style="font-size: 0.9rem;">${error.message}</p>
          <button onclick="loadCandidates()" class="retry-btn">Retry</button>
        </div>
      `;
    }
  }

  // ==================== DISPLAY CANDIDATES ====================
  function displayCandidates(candidates) {
    // Group candidates by position
    const grouped = candidates.reduce((acc, candidate) => {
      if (!acc[candidate.position]) {
        acc[candidate.position] = [];
      }
      acc[candidate.position].push(candidate);
      return acc;
    }, {});

    let html = "";

    for (const [position, positionCandidates] of Object.entries(grouped)) {
      html += `
        <div class="position-group">
          <h3 class="position-title">${position}</h3>
          <div class="candidates-grid">
      `;

      positionCandidates.forEach((candidate) => {
        html += `
          <div class="candidate-card" data-id="${candidate.id}">
            <div class="candidate-image">
              <img src="${BASE_URL}/uploads/${candidate.image}" 
                   alt="${candidate.name}" 
                   onerror="this.src='images/default-avatar.jpg'">
            </div>
            <div class="candidate-info">
              <h4>${candidate.name}</h4>
              <p class="candidate-position">${candidate.position}</p>
              <p class="vote-count">Votes: <strong>${
                candidate.votes || 0
              }</strong></p>
            </div>
            <button class="delete-btn" data-id="${
              candidate.id
            }">🗑️ Delete</button>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    }

    candidatesList.innerHTML = html;

    // Add delete event listeners
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", deleteCandidate);
    });
  }

  // ==================== ADD NEW CANDIDATE ====================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Adding Candidate...";
    messageBox.style.display = "none";

    try {
      const formData = new FormData(form);

      // Handle custom position
      let finalPosition = formData.get("position");
      if (finalPosition === "Others") {
        finalPosition = formData.get("customPosition") || "Other Position";
      }

      // Replace position in formData
      formData.delete("position");
      formData.append("position", finalPosition.toUpperCase());

      const response = await fetch(`${BASE_URL}/addCandidate`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(
          data.message || "✅ Candidate added successfully!",
          "success"
        );
        form.reset();
        customPositionGroup.style.display = "none"; // Reset custom field
        loadCandidates(); // Refresh the list
      } else {
        showMessage(data.error || "❌ Failed to add candidate", "error");
      }
    } catch (error) {
      console.error("❌ Error adding candidate:", error);
      showMessage("❌ Network error. Please check your connection.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });

  // ==================== DELETE CANDIDATE ====================
  async function deleteCandidate(e) {
    const candidateId = e.target.dataset.id;
    const candidateName = e.target
      .closest(".candidate-card")
      .querySelector("h4").textContent;

    if (
      !confirm(
        `Are you sure you want to delete "${candidateName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/candidates/${candidateId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("✅ Candidate deleted successfully!", "success");
        loadCandidates(); // Refresh the list
      } else {
        showMessage(data.error || "❌ Failed to delete candidate", "error");
      }
    } catch (error) {
      console.error("❌ Error deleting candidate:", error);
      showMessage("❌ Network error. Please check your connection.", "error");
    }
  }

  // ==================== HELPER FUNCTIONS ====================
  function showMessage(message, type) {
    messageBox.textContent = message;
    messageBox.className = `message-box ${type}`;
    messageBox.style.display = "block";

    // Auto-hide success messages
    if (type === "success") {
      setTimeout(() => {
        messageBox.style.display = "none";
      }, 5000);
    }
  }

  // ==================== INITIAL LOAD ====================
  loadCandidates();
});
