/**
 * src/pages/navbar.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Navigation bar component
 */

export function renderNavbar(currentPage, onNavigate) {
  const navbar = document.getElementById("navbar");
  navbar.innerHTML = `
    <div class="nav-logo" onclick="window.app.navigate('home')">
      <div class="nav-logo-box">
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
          <rect x="3" y="2" width="12" height="14" rx="2" stroke="white" stroke-width="1.4"/>
          <line x1="6" y1="6" x2="12" y2="6" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
          <line x1="6" y1="9" x2="12" y2="9" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
          <circle cx="13.5" cy="13.5" r="3" fill="#ef4444"/>
        </svg>
      </div>
      <div class="nav-logo-text">
        <h2>PhoneSafe AU</h2>
        <p>COS30045 · HCMC Group 3 · 2026-HX01</p>
      </div>
    </div>

    <div class="nav-links">
      <a class="${currentPage === "home" ? "active" : ""}" onclick="window.app.navigate('home')">Home</a>
      <a class="${currentPage === "category" ? "active" : ""}" onclick="window.app.navigate('category')">Category</a>
      <a class="${currentPage === "about" ? "active" : ""}" onclick="window.app.navigate('about')">About</a>
    </div>

    <button class="theme-toggle" onclick="window.app.toggleTheme()" title="Toggle light/dark theme">
      <span class="theme-icon">🌙</span>
    </button>
  `;
}
