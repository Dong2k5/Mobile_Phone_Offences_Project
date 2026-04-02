import React, { useState } from "react";
import AustraliaMap from "./AustraliaMap.jsx";
import Sidebar from "./Sidebar.jsx";

// ── Category selection component ──────────────────────────────────────────────
// Allows users to switch between Age Group and Population analysis views
// State is lifted to allow synchronization between map and sidebar charts

export default function CategoryPage({ initialCategory = "population" }) {
  // ── Page state: which category is the user viewing? ─────────────────────
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // ── Dashboard state: controls for year, action type, and selected state ──
  const [year, setYear] = useState(2020);
  const [actionType, setActionType] = useState("fines");     // "fines" | "charges" | "arrests"
  const [selState, setSelState] = useState(null);             // Selected state for map interaction
  const [covidOpen, setCovidOpen] = useState(false);         // COVID panel toggle

  return (
    <div>
      {/* ── Category Selection Header ─────────────────────────────────────── */}
      <section
        style={{
          padding: "32px",
          borderBottom: "1px solid var(--border)",
          background: "var(--panel)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 28,
              marginBottom: 24,
              color: "var(--text)",
            }}
          >
            Select Analysis Category
          </h1>

          {/* ── Category Selection Buttons ──────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            {/* Age Group Button */}
            <button
              onClick={() => setSelectedCategory("age")}
              style={{
                flex: 1,
                minWidth: 250,
                padding: "18px 24px",
                borderRadius: 10,
                border: selectedCategory === "age" 
                  ? "2px solid var(--accent)" 
                  : "1px solid rgba(59,130,246,0.2)",
                background: selectedCategory === "age"
                  ? "rgba(59,130,246,0.15)"
                  : "rgba(59,130,246,0.06)",
                color: selectedCategory === "age" ? "var(--accent)" : "var(--sub)",
                fontSize: 14,
                fontWeight: selectedCategory === "age" ? 600 : 500,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== "age") {
                  e.target.style.background = "rgba(59,130,246,0.1)";
                  e.target.style.borderColor = "rgba(59,130,246,0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== "age") {
                  e.target.style.background = "rgba(59,130,246,0.06)";
                  e.target.style.borderColor = "rgba(59,130,246,0.2)";
                }
              }}
            >
              <span style={{ fontSize: 18, marginRight: 10 }}>📊</span>
              Age Group Distribution
            </button>

            {/* Population Button */}
            <button
              onClick={() => setSelectedCategory("population")}
              style={{
                flex: 1,
                minWidth: 250,
                padding: "18px 24px",
                borderRadius: 10,
                border: selectedCategory === "population"
                  ? "2px solid var(--accent)"
                  : "1px solid rgba(239,68,68,0.2)",
                background: selectedCategory === "population"
                  ? "rgba(239,68,68,0.15)"
                  : "rgba(239,68,68,0.06)",
                color: selectedCategory === "population" ? "var(--accent)" : "var(--sub)",
                fontSize: 14,
                fontWeight: selectedCategory === "population" ? 600 : 500,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== "population") {
                  e.target.style.background = "rgba(239,68,68,0.1)";
                  e.target.style.borderColor = "rgba(239,68,68,0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== "population") {
                  e.target.style.background = "rgba(239,68,68,0.06)";
                  e.target.style.borderColor = "rgba(239,68,68,0.2)";
                }
              }}
            >
              <span style={{ fontSize: 18, marginRight: 10 }}>🗺️</span>
              Population Distribution
            </button>
          </div>
        </div>
      </section>

      {/* ── Content Area: Display selected category ─────────────────────────── */}
      <section>
        {/* Age Group Analysis View */}
        {selectedCategory === "age" && (
          <div style={{ padding: "20px" }}>
            <div
              style={{
                maxWidth: 1200,
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 300px",
                  gap: 20,
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                {/* ── Left: Age group title and description ──────────────── */}
                <div style={{ padding: "20px" }}>
                  <h2
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: 24,
                      marginBottom: 12,
                      color: "var(--text)",
                    }}
                  >
                    Age Group Analysis
                  </h2>
                  <p style={{ fontSize: 12, color: "var(--sub)", lineHeight: 1.6 }}>
                    This analysis breaks down mobile phone enforcement actions by age group. 
                    The data reveals which age demographics have the highest rates of offences 
                    related to mobile phone usage while driving. Use the controls to adjust 
                    the year and enforcement action type.
                  </p>
                </div>

                {/* ── Right: Sidebar with age chart controls ──────────────── */}
                <div />
              </div>

              {/* ── Charts: Age group data ─────────────────────────────────── */}
              <Sidebar
                year={year}
                setYear={setYear}
                actionType={actionType}
                setActionType={setActionType}
                selState={selState}
                setSelState={setSelState}
              />
            </div>
          </div>
        )}

        {/* Population Distribution View */}
        {selectedCategory === "population" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 300px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {/* ── Left: Map visualization ────────────────────────────────────── */}
            <div style={{ padding: 20, borderRight: "1px solid var(--border)" }}>
              {/* Header row with title and controls */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14, gap: 16 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>Fines by state &amp; territory</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                    Drag slider · click state to isolate · hover for detail
                  </div>
                </div>

                {/* ── Controls: Year slider and action type selector ────────── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 200 }}>
                  {/* Year display and slider */}
                  <div>
                    <div style={{ fontSize: 9, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 3 }}>Year</div>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, color: "var(--accent)", lineHeight: 1 }}>
                      {year}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={2008} max={2024} step={1}
                    value={year}
                    onChange={(e) => setYear(+e.target.value)}
                    style={{ width: "100%" }}
                  />

                  {/* ── Action type selector ────────────────────────────────── */}
                  <div>
                    <div style={{ fontSize: 9, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 5 }}>Action type</div>
                    <div style={{ display: "flex", gap: 5 }}>
                      {["fines", "charges", "arrests"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setActionType(type)}
                          className={`chip ${actionType === type ? "active" : ""}`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Australia Map: Shows geographic distribution of fines ───── */}
              <AustraliaMap
                year={year}
                actionType={actionType}
                selState={selState}
                setSelState={setSelState}
              />

              {/* ── Colour legend for map intensity ────────────────────────── */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: "var(--muted)", marginTop: 8 }}>
                <span>Low</span>
                <div style={{ flex: 1, height: 5, borderRadius: 3, background: "linear-gradient(to right,#1e3a5f,#1d4ed8,#3b82f6,#93c5fd)" }} />
                <span>High</span>
              </div>
            </div>

            {/* ── Right: Sidebar ──────────────────────────────────────────────── */}
            <Sidebar
              year={year}
              setYear={setYear}
              actionType={actionType}
              setActionType={setActionType}
              selState={selState}
              setSelState={setSelState}
            />
          </div>
        )}
      </section>
    </div>
  );
}
