import React from "react";

/**
 * AboutPage Component
 * ─────────────────────────────────────────────────────────────────────────────
 * Project information page for PhoneSafe AU
 * Displays: project overview, data source, color palette, and team members
 */
export default function AboutPage() {
  // ── Team members with IDs ────────────────────────────────────────────────
  const teamMembers = [
    { name: "Nguyen Minh Kiet", initials: "NK", id: "104761301" },
    { name: "Le Pham Tu Quynh", initials: "LQ", id: "104813697" },
    { name: "Nguyen Pham Minh Dong", initials: "ND", id: "104773649" },
  ];

  // ── Color palette used in the dashboard ──────────────────────────────────
  const colors = [
    { hex: "#16253B", name: "Navy Dark" },
    { hex: "#253B5A", name: "Navy Medium" },
    { hex: "#385C91", name: "Blue" },
    { hex: "#A8C4E8", name: "Blue Light" },
    { hex: "#FFFFFF", name: "White" },
  ];

  return (
    <div style={{ background: "var(--navy)", minHeight: "calc(100vh - 300px)" }}>
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "60px 32px",
          borderBottom: "1px solid var(--border)",
          background: "linear-gradient(135deg, rgba(59,130,246,0.06) 0%, transparent 60%)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 42,
              marginBottom: 16,
              color: "var(--text)",
              lineHeight: 1.2,
            }}
          >
            About this project
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--sub)",
              lineHeight: 1.6,
              marginBottom: 0,
            }}
          >
            COS30045 Data Visualisation · HCMC Group 3 · Semester 2026-HX01
          </p>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <section style={{ padding: "60px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* ── Project Overview ────────────────────────────────────────────── */}
          <div style={{ marginBottom: 60 }}>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 28,
                marginBottom: 24,
                color: "var(--accent)",
              }}
            >
              Project overview
            </h2>
            <div style={{ fontSize: 14, color: "var(--sub)", lineHeight: 1.8 }}>
              <p>
                This dashboard visualises mobile phone enforcement data across Australia from 2008 to 2024. 
                It was built as a data visualisation project for COS30045 at Swinburne University. The goal 
                is to transform raw police enforcement records into interactive, accessible visual insights 
                for policymakers, road safety analysts, and the general public.
              </p>
            </div>
          </div>

          {/* ── Data Source ─────────────────────────────────────────────────── */}
          <div style={{ marginBottom: 60 }}>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 28,
                marginBottom: 24,
                color: "var(--accent)",
              }}
            >
              Data source
            </h2>
            <div style={{ fontSize: 14, color: "var(--sub)", lineHeight: 1.8 }}>
              <p>
                Data obtained from{" "}
                <a
                  href="https://datahub.roadsafety.gov.au"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--accent)", textDecoration: "none" }}
                >
                  datahub.roadsafety.gov.au
                </a>{" "}
                — an official Australian government open-data platform. The dataset contains 12,179 records 
                of mobile phone usage offences while driving, covering all states and territories from 2008 
                to 2024. Data was cleaned and processed using KNIME Analytics Platform.
              </p>
            </div>
          </div>

          {/* ── Colour Palette ──────────────────────────────────────────────── */}
          <div style={{ marginBottom: 60 }}>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 28,
                marginBottom: 24,
                color: "var(--accent)",
              }}
            >
              Colour palette
            </h2>
            <div style={{ fontSize: 14, color: "var(--sub)", lineHeight: 1.8, marginBottom: 20 }}>
              <p>
                Five-tone monochromatic blue palette — chosen to convey authority, data clarity, and 
                road-safety seriousness. Accessible contrast ratios maintained throughout.
              </p>
            </div>
            {/* ── Color swatches ──────────────────────────────────────────────── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 16,
              }}
            >
              {colors.map((color) => (
                <div key={color.hex} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "100%",
                      height: 100,
                      borderRadius: 8,
                      background: color.hex,
                      border: color.hex === "#FFFFFF" ? "1px solid var(--border)" : "none",
                      marginBottom: 12,
                    }}
                  />
                  <div style={{ fontSize: 11, color: "var(--light)", fontFamily: "monospace" }}>
                    {color.hex}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>
                    {color.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Team Members ────────────────────────────────────────────────── */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 60 }}>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 28,
                marginBottom: 32,
                color: "var(--accent)",
              }}
            >
              Team members
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 32,
              }}
            >
              {teamMembers.map((member) => (
                <div
                  key={member.initials}
                  style={{
                    padding: 24,
                    borderRadius: 12,
                    background: "rgba(59,130,246,0.08)",
                    border: "1px solid rgba(59,130,246,0.15)",
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--navy)",
                      fontWeight: 700,
                      fontSize: 20,
                      marginBottom: 16,
                    }}
                  >
                    {member.initials}
                  </div>
                  <h3
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--text)",
                      marginBottom: 8,
                    }}
                  >
                    {member.name}
                  </h3>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--muted)",
                      fontFamily: "monospace",
                    }}
                  >
                    {member.id}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
