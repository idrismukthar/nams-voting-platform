// js/results.js
document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("resultsContainer");
  const BASE_URL = "http://localhost:4000";
  let refreshInterval;

  // ==================== FETCH AND DISPLAY RESULTS ====================
  async function fetchResults() {
    try {
      const response = await fetch(`${BASE_URL}/results`);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const results = await response.json();
      displayResults(results);
    } catch (error) {
      console.error("❌ Error fetching results:", error);
      showError("Unable to load results. Please check your connection.");
    }
  }

  // ==================== DISPLAY RESULTS ====================
  function displayResults(results) {
    if (!results || results.length === 0) {
      resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>No voting results available yet.</p>
                    <p style="margin-top: 0.5rem; color: #6c757d;">Candidates need to be added and votes cast.</p>
                </div>
            `;
      return;
    }

    // Group results by position
    const grouped = results.reduce((acc, result) => {
      if (!acc[result.position]) {
        acc[result.position] = [];
      }
      acc[result.position].push(result);
      return acc;
    }, {});

    let html = "";

    for (const [position, candidates] of Object.entries(grouped)) {
      // Find winner for this position
      const maxVotes = Math.max(...candidates.map((c) => c.votes));
      const totalVotes = candidates[0]?.total_votes_position || 0;
      const totalVoters = candidates[0]?.total_voters || 0;

      html += `
                <div class="position-block">
                    <div class="position-title">
                        <span>${position}</span>
                        <div class="position-stats">
                            ${totalVotes} votes • ${totalVoters} voters
                        </div>
                    </div>
            `;

      // Sort candidates by votes (descending)
      candidates.sort((a, b) => b.votes - a.votes);

      candidates.forEach((candidate) => {
        const isWinner = candidate.votes === maxVotes && maxVotes > 0;
        const percentage =
          totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0;

        html += `
                    <div class="candidate ${isWinner ? "winner" : ""}">
                        <div class="candidate-info">
                            <div class="candidate-image">
                                <img src="${BASE_URL}/uploads/${
          candidate.image
        }" 
                                     alt="${candidate.name}"
                                     onerror="this.src='images/default-avatar.jpg'">
                            </div>
                            <div class="candidate-details">
                                <div class="candidate-name">${
                                  candidate.name
                                }</div>
                                <div class="candidate-position">${
                                  candidate.position
                                }</div>
                            </div>
                        </div>
                        <div class="vote-count">${candidate.votes} votes</div>
                    </div>
                    <div class="bar-container">
                        <div class="bar" style="width: ${percentage}%"></div>
                        <div class="percentage">${percentage.toFixed(1)}%</div>
                    </div>
                `;
      });

      html += `</div>`;
    }

    resultsContainer.innerHTML = html;

    // Add animations to bars
    animateBars();
  }

  // ==================== ANIMATE PROGRESS BARS ====================
  function animateBars() {
    const bars = document.querySelectorAll(".bar");
    bars.forEach((bar) => {
      const width = bar.style.width;
      bar.style.width = "0%";
      setTimeout(() => {
        bar.style.width = width;
      }, 100);
    });
  }

  // ==================== SHOW ERROR ====================
  function showError(message) {
    resultsContainer.innerHTML = `
            <div class="error-message">
                <p>❌ ${message}</p>
                <button class="retry-btn" onclick="location.reload()">Retry</button>
            </div>
        `;
  }

  // ==================== AUTO-REFRESH ====================
  function startAutoRefresh() {
    // Refresh every 60 seconds (1 minute)
    refreshInterval = setInterval(fetchResults, 60000);
  }

  // ==================== INITIALIZE ====================
  function initialize() {
    fetchResults(); // Load immediately
    startAutoRefresh(); // Start auto-refresh

    // Also refresh when page becomes visible
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        fetchResults();
      }
    });
  }

  // Start everything
  initialize();

  // Cleanup on page unload
  window.addEventListener("beforeunload", () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
  });
});
