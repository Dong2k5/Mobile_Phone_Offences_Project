import React from "react";

/**
 * HomePage Component
 * ─────────────────────────────────────────────────────────────────────────────
 * Landing page for PhoneSafe AU dashboard
 * Displays: dataset introduction, category selection buttons
 *
 * @param {Function} onNavigate - Callback to navigate to different pages
 */
export default function HomePage({ onNavigate }) {
  return (
    <div>
      {/* ── Hero Section: Title ─────────────────────────────────────────────── */}
      <section
        style={{
          padding: "60px 32px",
          borderBottom: "1px solid var(--border)",
          background: "linear-gradient(135deg, rgba(59,130,246,0.06) 0%, transparent 60%)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 10, letterSpacing: ".1em",
              color: "var(--light)", textTransform: "uppercase",
              marginBottom: 10,
              display: "flex", alignItems: "center", gap: 7,
            }}
          >
            <span
              className="pulse"
              style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }}
            />
            Australian road safety enforcement
          </div>

          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 48, lineHeight: 1.1, marginBottom: 20,
            }}
          >
            Mobile phone fines<br />
            across{" "}
            <em style={{ fontStyle: "italic", color: "var(--light)" }}>Australia</em>
          </h1>

          <p style={{ fontSize: 14, color: "var(--sub)", lineHeight: 1.7 }}>
            16 years of police enforcement data — from jurisdiction trends to the
            COVID-19 paradox. Explore by age group or geographic distribution.
          </p>
        </div>
      </section>

      {/* ── Storyboard: Dataset Introduction ─────────────────────────────────── */}
      {/* This section provides academic context about the mobile phone enforcement dataset */}
      <section
        style={{
          padding: "40px 32px",
          borderBottom: "1px solid var(--border)",
          background: "var(--panel)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 26,
              marginBottom: 20,
              color: "var(--text)",
            }}
          >
            Dataset Overview
          </h2>

          <div style={{ fontSize: 13, lineHeight: 1.8, color: "var(--sub)" }}>
            <p style={{ marginBottom: 16 }}>
              This comprehensive analysis examines enforcement actions related to mobile phone usage 
              while driving across all Australian states and territories from 2008 to 2024. The dataset 
              captures the evolving landscape of road safety enforcement as regulations have tightened 
              and public awareness has increased.
            </p>

            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
                Key Findings:
              </h3>
              <ul style={{ marginLeft: 20, color: "var(--sub)" }}>
                <li style={{ marginBottom: 8 }}>
                  Mobile phone fines have increased by 204% over the 16-year period, indicating stricter enforcement
                </li>
                <li style={{ marginBottom: 8 }}>
                  Victoria leads the nation with 34% of all enforcement actions, reflecting higher urban density and traffic volumes
                </li>
                <li style={{ marginBottom: 8 }}>
                  The 26–39 age group accounts for 35% of offences, representing the largest demographic risk group
                </li>
                <li style={{ marginBottom: 8 }}>
                  2020 marked a peak in enforcement activity, coinciding with increased mobility after initial COVID-19 lockdowns
                </li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
                Data Classification:
              </h3>
              <ul style={{ marginLeft: 20, color: "var(--sub)" }}>
                <li style={{ marginBottom: 8 }}>
                  <strong>Fines:</strong> Penalties issued for mobile phone usage while driving
                </li>
                <li style={{ marginBottom: 8 }}>
                  <strong>Charges:</strong> More serious formal charges brought against repeat or severe offenders
                </li>
                <li>
                  <strong>Arrests:</strong> Cases resulting in law enforcement custody or court proceedings
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Selection: Centered Containers ──────────────────────────── */}
      {/* Users can explore data by Age Group or Population (Geographic) distribution */}
      <section
        style={{
          padding: "60px 32px",
          background: "var(--navy)",
          minHeight: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 1000 }}>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 32,
              marginBottom: 40,
              color: "var(--text)",
            }}
          >
            Explore Analysis by Category
          </h2>

          {/* ── Two category containers ─────────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              justifyContent: "center",
            }}
          >
            {/* ── Age Group Container ──────────────────────────────────────── */}
            <div
              onClick={() => onNavigate("category", "age")}
              style={{
                padding: "32px",
                borderRadius: 12,
                background: "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(13,27,46,0.6) 100%)",
                border: "1px solid rgba(59,130,246,0.2)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(13,27,46,0.7) 100%)";
                e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(13,27,46,0.6) 100%)";
                e.currentTarget.style.borderColor = "rgba(59,130,246,0.2)";
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 12 }}>📊</div>
              <h3
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 22,
                  marginBottom: 12,
                  color: "var(--text)",
                }}
              >
                Age Group Analysis
              </h3>
              <p style={{ fontSize: 12, color: "var(--sub)", lineHeight: 1.6 }}>
                Examine mobile phone fines distribution across different age demographics
              </p>
            </div>

            {/* ── Population Container ─────────────────────────────────────── */}
            <div
              onClick={() => onNavigate("category")}
              style={{
                padding: "32px",
                borderRadius: 12,
                background: "linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(13,27,46,0.6) 100%)",
                border: "1px solid rgba(239,68,68,0.2)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(13,27,46,0.7) 100%)";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(13,27,46,0.6) 100%)";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 12 }}>🗺️</div>
              <h3
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 22,
                  marginBottom: 12,
                  color: "var(--text)",
                }}
              >
                Population Distribution
              </h3>
              <p style={{ fontSize: 12, color: "var(--sub)", lineHeight: 1.6 }}>
                Explore mobile phone fines across states, territories, and geographic regions
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
