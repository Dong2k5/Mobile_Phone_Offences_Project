import React, { useState } from "react";
// ── Component imports ────────────────────────────────────────────────────────
// Navbar: Navigation bar with links to Home, Category, About pages
// HomePage: Landing page with dataset introduction and category selection
// CategoryPage: Analysis view with Age Group and Population category options
// AboutPage: Information about the project, data source, and team
// Footer: Footer section with data attribution and project metadata
import Navbar      from "./components/Navbar.jsx";
import HomePage    from "./components/HomePage.jsx";
import CategoryPage from "./components/CategoryPage.jsx";
import AboutPage   from "./components/AboutPage.jsx";
import Footer      from "./components/Footer.jsx";

export default function App() {
  // ── Application routing state ────────────────────────────────────────────
  // Controls which page is currently displayed
  // Values: "home", "category", "about"
  const [currentPage, setCurrentPage] = useState("home");
  
  // ── Category selection state for the category page ──────────────────────
  // Tracks which analysis view is selected: "age" | "population"
  const [selectedCategory, setSelectedCategory] = useState("population");

  // ── Page navigation handler ──────────────────────────────────────────────
  // Updates the current page based on user navigation
  const handleNavigate = (page, category = null) => {
    setCurrentPage(page);
    if (category) {
      setSelectedCategory(category);
    }
  };

  return (
    <div style={{ background: "var(--navy)", minHeight: "100vh" }}>
      {/* ── Navigation bar appears on all pages ────────────────────────────── */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* ── Page content: Rendered based on current route ──────────────────── */}
      {currentPage === "home" && <HomePage onNavigate={handleNavigate} />}
      {currentPage === "category" && <CategoryPage initialCategory={selectedCategory} />}
      {currentPage === "about" && <AboutPage />}

      {/* ── Footer appears on all pages ────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
