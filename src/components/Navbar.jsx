import React from "react";

// ── Navigation links for the PhoneSafe AU dashboard ────────────────────────
// Only three main pages: Home, Category, and About
const NAV_LINKS = ["Home", "Category", "About"];

export default function Navbar({ currentPage, onNavigate }) {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 28px",
        borderBottom: "1px solid var(--border)",
        background: "rgba(13,27,46,0.95)",
        backdropFilter: "blur(8px)",
        position: "sticky",
        top: 0,
        zIndex: 200,
      }}
    >
      {/* ── Logo section ────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => onNavigate("home")}>
        <div
          style={{
            width: 30, height: 30,
            background: "var(--accent)",
            borderRadius: 7,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <rect x="3" y="2" width="12" height="14" rx="2" stroke="white" strokeWidth="1.4"/>
            <line x1="6" y1="6"  x2="12" y2="6"  stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="6" y1="9"  x2="12" y2="9"  stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
            <circle cx="13.5" cy="13.5" r="3" fill="#ef4444"/>
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 14 }}>
            PhoneSafe AU
          </div>
          <div style={{ fontSize: 10, color: "var(--muted)" }}>
            Mobile enforcement · 2008–2024
          </div>
        </div>
      </div>

      {/* ── Navigation links ────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 20 }}>
        {NAV_LINKS.map((link) => {
          // Determine if this link is currently active
          const isActive = 
            (link === "Home" && currentPage === "home") ||
            (link === "Category" && currentPage === "category") ||
            (link === "About" && currentPage === "about");
          
          return (
            <span
              key={link}
              onClick={() => onNavigate(link.toLowerCase())}
              style={{
                fontSize: 11,
                color: isActive ? "var(--accent)" : "var(--muted)",
                cursor: "pointer",
                fontWeight: isActive ? 600 : 400,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => !isActive && (e.target.style.color = "var(--text)")}
              onMouseLeave={(e) => !isActive && (e.target.style.color = "var(--muted)")}
            >
              {link}
            </span>
          );
        })}
      </div>

      {/* ── Badge ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          fontSize: 10, padding: "3px 10px",
          borderRadius: 20,
          background: "rgba(59,130,246,0.12)",
          border: "1px solid rgba(59,130,246,0.25)",
          color: "var(--light)",
        }}
      >
        COS30045 · Group 3
      </div>
    </nav>
  );
}
