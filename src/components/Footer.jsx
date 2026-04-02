import React from "react";

/**
 * Footer Component
 * ─────────────────────────────────────────────────────────────────────────────
 * Displays attribution, data source information, and project metadata
 * Appears at the bottom of every page
 */
export default function Footer() {
  return (
    <footer
      style={{
        padding: "16px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: "1px solid var(--border)",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      {/* ── Data source attribution ────────────────────────────────────────── */}
      <div style={{ fontSize: 10, color: "var(--muted)" }}>
        Data:{" "}
        <a
          href="https://datahub.roadsafety.gov.au"
          target="_blank"
          rel="noreferrer"
          style={{ color: "var(--light)", textDecoration: "none" }}
        >
          datahub.roadsafety.gov.au
        </a>{" "}
        · Police enforcement 2008–2024 · 12,179 records
      </div>

      {/* ── Project metadata tags ──────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 6 }}>
        {["COS30045", "HCMC Group 3", "2026-HX01"].map((t) => (
          <span
            key={t}
            style={{
              fontSize: 9, padding: "2px 8px",
              borderRadius: 20,
              border: "1px solid var(--border)",
              color: "var(--muted)",
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* ── Copyright and project info ───────────────────────────────────── */}
      <div style={{ fontSize: 10, color: "var(--muted)" }}>
        © 2026 PhoneSafe AU · Data visualisation project
      </div>
    </footer>
  );
}
