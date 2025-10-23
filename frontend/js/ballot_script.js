// js/ballot.js
document.addEventListener("DOMContentLoaded", async () => {
  // DOM Elements
  const welcomeEl = document.getElementById("welcome-user");
  const grid = document.getElementById("candidates-grid");
  const submitBtn = document.getElementById("submitVoteBtn");
  const msgBox = document.getElementById("vote-message");
  const modal = document.getElementById("successModal");
  const closeModalBtn = document.getElementById("closeModalBtn");

  const BASE_URL = window.SERVER_CONFIG?.url || "http://localhost:4000";

  // ==================== AUTH CHECK ====================
  const userData = localStorage.getItem("nams_user");
  if (!userData) {
    alert("⚠️ Please log in first!");
    window.location.href = "login.html";
    return;
  }

  // ✅ FIXED: Get the actual user's name from localStorage
  const user = JSON.parse(userData);
  const userFullName = user.fullname || user.fullName || "Student"; // Handle different key names

  // ✅ PERSONALIZED Welcome Message
  welcomeEl.textContent = `Welcome, ${userFullName}! 👋`;
  welcomeEl.style.opacity = "1";

  // ==================== MODAL FUNCTIONS ====================
  function showModal() {
    modal.classList.add("show");
  }

  function closeModal() {
    modal.classList.remove("show");
    // Redirect to results after modal closes
    setTimeout(() => {
      window.location.href = "results.html";
    }, 500);
  }

  closeModalBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // ==================== LOAD CANDIDATES ====================
  async function loadCandidates() {
    try {
      grid.innerHTML = '<div class="loading-text">Loading candidates...</div>';

      const response = await fetch(`${BASE_URL}/candidates`);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const candidates = await response.json();

      if (!candidates || candidates.length === 0) {
        grid.innerHTML =
          '<div class="no-candidates">No candidates available yet. Check back later.</div>';
        submitBtn.disabled = true;
        return;
      }

      displayCandidates(candidates);
    } catch (error) {
      console.error("❌ Error loading candidates:", error);
      grid.innerHTML = `
        <div class="error-message">
          <p>❌ Failed to load candidates</p>
          <p style="font-size: 0.9rem; margin-top: 0.5rem;">${error.message}</p>
          <button onclick="loadCandidates()" class="retry-btn">Retry</button>
        </div>
      `;
    }
  }

  // ==================== DISPLAY CANDIDATES ====================
  function displayCandidates(candidates) {
    // Group by position
    const grouped = {};
    candidates.forEach((candidate) => {
      if (!grouped[candidate.position]) {
        grouped[candidate.position] = [];
      }
      grouped[candidate.position].push(candidate);
    });

    let html = "";

    for (const [position, positionCandidates] of Object.entries(grouped)) {
      html += `
        <div class="position-section">
          <h3 class="position-title">${position.toUpperCase()}</h3>
          <div class="candidates-row">
      `;

      positionCandidates.forEach((candidate) => {
        html += `
          <div class="candidate-card">
            <img src="${BASE_URL}/uploads/${candidate.image}" 
                 alt="${candidate.name}" 
                 class="candidate-img"
                 onerror="this.src='images/default-avatar.jpg'">
            <p class="candidate-name">${candidate.name}</p>
            <label class="vote-label">
              <input type="radio" name="${position}" value="${candidate.id}">
              <span class="radio-custom"></span>
              Vote for ${candidate.name.split(" ")[0]}
            </label>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    }

    grid.innerHTML = html;
  }

  // ==================== SUBMIT VOTE ====================
  async function submitVote() {
    // Collect selected votes
    const selectedRadios = document.querySelectorAll(
      'input[type="radio"]:checked'
    );

    if (selectedRadios.length === 0) {
      showMessage("⚠️ Please select at least one candidate.", "error");
      return;
    }

    const votes = Array.from(selectedRadios).map((radio) => ({
      candidate_id: parseInt(radio.value),
      position: radio.name,
    }));

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting Vote...";
    msgBox.style.display = "none";

    try {
      const response = await fetch(`${BASE_URL}/submitVote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matric: user.matric, // ✅ Use the actual user's matric
          votes: votes,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("✅ Vote submitted successfully!", "success");
        submitBtn.textContent = "Vote Submitted ✅";
        submitBtn.disabled = true;

        // Disable all radio buttons
        document.querySelectorAll('input[type="radio"]').forEach((radio) => {
          radio.disabled = true;
        });

        // Show success modal after delay
        setTimeout(showModal, 1000);
      } else {
        showMessage(`❌ ${data.error || "Failed to submit vote"}`, "error");
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Vote 🗳️";
      }
    } catch (error) {
      console.error("❌ Vote submission error:", error);
      showMessage("❌ Network error. Please check your connection.", "error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Vote 🗳️";
    }
  }

  // ==================== HELPER FUNCTIONS ====================
  function showMessage(message, type) {
    msgBox.textContent = message;
    msgBox.className = `message-box ${type}`;
    msgBox.style.display = "block";

    if (type === "error") {
      setTimeout(() => {
        msgBox.style.display = "none";
      }, 5000);
    }
  }

  // js/ballot.js - UPDATED VERSION
  document.addEventListener("DOMContentLoaded", async () => {
    // DOM Elements
    const welcomeEl = document.getElementById("welcome-user");
    const grid = document.getElementById("candidates-grid");
    const submitBtn = document.getElementById("submitVoteBtn");
    const msgBox = document.getElementById("vote-message");
    const modal = document.getElementById("successModal");
    const alreadyVotedModal = document.getElementById("alreadyVotedModal");
    const closeModalBtn = document.getElementById("closeModalBtn");

    const BASE_URL = window.SERVER_CONFIG?.url || "http://localhost:4000";

    // ==================== AUTH CHECK ====================
    const userData = localStorage.getItem("nams_user");
    if (!userData) {
      alert("⚠️ Please log in first!");
      window.location.href = "login.html";
      return;
    }

    const user = JSON.parse(userData);
    const userFullName = user.fullname || user.fullName || "Student";
    const userMatric = user.matric;

    // ✅ PERSONALIZED Welcome Message
    welcomeEl.textContent = `Welcome, ${userFullName}! 👋`;
    welcomeEl.style.opacity = "1";

    // ==================== CHECK IF USER ALREADY VOTED ====================
    async function checkVoteStatus() {
      try {
        const response = await fetch(`${BASE_URL}/checkVote/${userMatric}`);

        if (response.ok) {
          const data = await response.json();

          if (data.hasVoted) {
            // User has already voted - show the already voted modal
            showAlreadyVotedModal();
            disableBallot();
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error("❌ Error checking vote status:", error);
        return false;
      }
    }

    // ==================== MODAL FUNCTIONS ====================
    function showModal() {
      modal.classList.add("show");
    }

    function closeModal() {
      modal.classList.remove("show");
      // Redirect to results after modal closes
      setTimeout(() => {
        window.location.href = "results.html";
      }, 500);
    }

    function showAlreadyVotedModal() {
      alreadyVotedModal.classList.add("show");
      disableBallot();
    }

    function closeAlreadyVotedModal() {
      alreadyVotedModal.classList.remove("show");
    }

    function viewResults() {
      closeAlreadyVotedModal();
      window.location.href = "results.html";
    }

    // Make functions global for HTML onclick
    window.closeAlreadyVotedModal = closeAlreadyVotedModal;
    window.viewResults = viewResults;

    closeModalBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    alreadyVotedModal.addEventListener("click", (e) => {
      if (e.target === alreadyVotedModal) closeAlreadyVotedModal();
    });

    // ==================== DISABLE BALLOT ====================
    function disableBallot() {
      // Disable submit button
      submitBtn.disabled = true;
      submitBtn.textContent = "Already Voted ✅";
      submitBtn.style.background = "#6c757d";

      // Disable all radio buttons
      document.querySelectorAll('input[type="radio"]').forEach((radio) => {
        radio.disabled = true;
      });

      // Hide the candidates grid or show message
      grid.innerHTML = `
      <div class="already-voted-message">
        <h3>Thank You for Voting! 🎉</h3>
        <p>You have already cast your vote in this election.</p>
        <p>Your participation helps shape the future of NAMS LASU.</p>
        <button onclick="viewResults()" class="view-results-btn">View Live Results</button>
      </div>
    `;
    }

    // ==================== LOAD CANDIDATES ====================
    async function loadCandidates() {
      // First check if user has already voted
      const hasVoted = await checkVoteStatus();
      if (hasVoted) {
        return; // Stop here if user already voted
      }

      try {
        grid.innerHTML =
          '<div class="loading-text">Loading candidates...</div>';

        const response = await fetch(`${BASE_URL}/candidates`);

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const candidates = await response.json();

        if (!candidates || candidates.length === 0) {
          grid.innerHTML =
            '<div class="no-candidates">No candidates available yet. Check back later.</div>';
          submitBtn.disabled = true;
          return;
        }

        displayCandidates(candidates);
      } catch (error) {
        console.error("❌ Error loading candidates:", error);
        grid.innerHTML = `
        <div class="error-message">
          <p>❌ Failed to load candidates</p>
          <p style="font-size: 0.9rem; margin-top: 0.5rem;">${error.message}</p>
          <button onclick="loadCandidates()" class="retry-btn">Retry</button>
        </div>
      `;
      }
    }

    // ==================== DISPLAY CANDIDATES ====================
    function displayCandidates(candidates) {
      // Group by position
      const grouped = {};
      candidates.forEach((candidate) => {
        if (!grouped[candidate.position]) {
          grouped[candidate.position] = [];
        }
        grouped[candidate.position].push(candidate);
      });

      let html = "";

      for (const [position, positionCandidates] of Object.entries(grouped)) {
        html += `
        <div class="position-section">
          <h3 class="position-title">${position.toUpperCase()}</h3>
          <div class="candidates-row">
      `;

        positionCandidates.forEach((candidate) => {
          html += `
          <div class="candidate-card">
            <img src="${BASE_URL}/uploads/${candidate.image}" 
                 alt="${candidate.name}" 
                 class="candidate-img"
                 onerror="this.src='images/default-avatar.jpg'">
            <p class="candidate-name">${candidate.name}</p>
            <label class="vote-label">
              <input type="radio" name="${position}" value="${candidate.id}">
              <span class="radio-custom"></span>
              Vote for ${candidate.name.split(" ")[0]}
            </label>
          </div>
        `;
        });

        html += `
          </div>
        </div>
      `;
      }

      grid.innerHTML = html;
    }

    // ==================== SUBMIT VOTE ====================
    async function submitVote() {
      // Collect selected votes
      const selectedRadios = document.querySelectorAll(
        'input[type="radio"]:checked'
      );

      if (selectedRadios.length === 0) {
        showMessage("⚠️ Please select at least one candidate.", "error");
        return;
      }

      const votes = Array.from(selectedRadios).map((radio) => ({
        candidate_id: parseInt(radio.value),
        position: radio.name,
      }));

      // Show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting Vote...";
      msgBox.style.display = "none";

      try {
        const response = await fetch(`${BASE_URL}/submitVote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            matric: userMatric,
            votes: votes,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          showMessage("✅ Vote submitted successfully!", "success");
          submitBtn.textContent = "Vote Submitted ✅";
          submitBtn.disabled = true;

          // Disable all radio buttons
          document.querySelectorAll('input[type="radio"]').forEach((radio) => {
            radio.disabled = true;
          });

          // Show success modal after delay
          setTimeout(showModal, 1000);
        } else {
          showMessage(`❌ ${data.error || "Failed to submit vote"}`, "error");
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit Vote 🗳️";
        }
      } catch (error) {
        console.error("❌ Vote submission error:", error);
        showMessage("❌ Network error. Please check your connection.", "error");
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Vote 🗳️";
      }
    }

    // ==================== HELPER FUNCTIONS ====================
    function showMessage(message, type) {
      msgBox.textContent = message;
      msgBox.className = `message-box ${type}`;
      msgBox.style.display = "block";

      if (type === "error") {
        setTimeout(() => {
          msgBox.style.display = "none";
        }, 5000);
      }
    }

    // ==================== EVENT LISTENERS ====================
    submitBtn.addEventListener("click", submitVote);

    // ==================== INITIALIZE ====================
    loadCandidates();
  });

  // ==================== EVENT LISTENERS ====================
  submitBtn.addEventListener("click", submitVote);

  // ==================== INITIALIZE ====================
  loadCandidates();
});
