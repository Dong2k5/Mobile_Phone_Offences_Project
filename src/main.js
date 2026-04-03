/**
 * src/main.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Application entry point - initializes routing and page management
 */

import { renderNavbar } from "./pages/navbar.js";
import { renderFooter } from "./pages/footer.js";
import { renderHomePage } from "./pages/homePage.js";
import { renderCategoryPage } from "./pages/categoryPage.js";
import { renderAboutPage } from "./pages/aboutPage.js";

class App {
  constructor() {
    this.currentPage = "home";
    this.selectedCategory = "population";
    this.init();
  }

  init() {
    // Make app globally accessible
    window.app = this;
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      document.body.classList.add("light-theme");
    }
    
    // Render initial page
    this.navigate("home");
  }

  navigate(page, category = null) {
    this.currentPage = page;
    if (category) {
      this.selectedCategory = category;
    }

    // Render navbar and footer (same for all pages)
    renderNavbar(this.currentPage, this.navigate.bind(this));
    renderFooter();

    // Render page-specific content
    switch (page) {
      case "home":
        renderHomePage();
        break;
      case "category":
        renderCategoryPage(this.selectedCategory);
        break;
      case "about":
        renderAboutPage();
        break;
      default:
        renderHomePage();
    }

    // Scroll to top
    window.scrollTo(0, 0);
  }

  toggleTheme() {
    // Toggle the light-theme class on the body
    document.body.classList.toggle("light-theme");
    
    // Save preference to localStorage
    const isLightTheme = document.body.classList.contains("light-theme");
    localStorage.setItem("theme", isLightTheme ? "light" : "dark");
    
    // Update icon
    const icon = document.querySelector(".theme-icon");
    if (icon) {
      icon.textContent = isLightTheme ? "☀️" : "🌙";
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new App());
} else {
  new App();
}
