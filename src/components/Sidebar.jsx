import React, { useRef, useEffect } from "react";
// ── Chart visualization library ──────────────────────────────────────────────
import { Chart, registerables } from "chart.js";
// ── Data utilities: functions to compute enforcement statistics ────────────────
import {
  getYearData, getTotal, buildTrendTotals,
  STATES, AGE_DATA,
} from "../data/enforcement.js";

// ── Initialize Chart.js plugins ──────────────────────────────────────────────
Chart.register(...registerables);

/**
 * Sidebar Component
 * ─────────────────────────────────────────────────────────────────────────────
 * Displays enforcement analytics including:
 * - State rankings with interactive bar chart
 * - National trends over time (2008-2024)
 * - Age group distribution
 * - Key statistics cards (total fines, top state, etc.)
 *
 * @param {number} year - Current year for filtering data
 * @param {Function} setYear - Updates the selected year
 * @param {string} actionType - Type of enforcement ("fines", "charges", "arrests")
 * @param {string} selState - Currently selected state for highlighting
 * @param {Function} setSelState - Updates selected state
 */
export default function Sidebar({ year, setYear, actionType, selState, setSelState }) {
  // ── Canvas references for Chart.js instances ────────────────────────────
  const trendRef = useRef(null);     // National trend line chart
  const trendInst = useRef(null);    // Chart.js instance for trend
  const ageRef  = useRef(null);      // Age group bar chart
  const ageInst = useRef(null);      // Chart.js instance for age

  // ── Computed statistics: derives metrics from enforcement data ──────────
  const data     = getYearData(actionType, year);        // Data for current year
  const prevData = getYearData(actionType, year - 1);    // Data for previous year
  const tot      = getTotal(data);                       // Total fines/charges/arrests
  const prevTot  = getTotal(prevData);                   // Total from previous year
  const delta    = prevTot ? Math.round(((tot - prevTot) / prevTot) * 100) : 0; // Year-over-year change %
  const sorted   = STATES.slice().sort((a, b) => (data[b] ?? 0) - (data[a] ?? 0)); // Sort states by enforcement volume
  const max      = data[sorted[0]] ?? 1;                 // Maximum value for bar chart scaling
  const top      = sorted[0];                            // Highest enforcement state
  const topPct   = Math.round(((data[top] ?? 0) / tot) * 100); // Top state's percentage

  // ── National trend data: builds array of total fines for each year 2008-2024 ─
  const totals = buildTrendTotals();
  const years  = Array.from({ length: 17 }, (_, i) => 2008 + i);

  // ── Effect: Initialize trend chart on mount ────────────────────────────────
  // Creates a line chart showing enforcement trends over 16 years. Users can
  // click a data point to jump to that year and update the sidebar.
  useEffect(() => {
    if (!trendRef.current) return;
    trendInst.current?.destroy(); // Cleanup previous instance

    trendInst.current = new Chart(trendRef.current, {
      type: "line",
      data: {
        labels: years.map(String),
        datasets: [{
          data: totals,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.07)",
          borderWidth: 1.8,
          // Highlight current year with larger point
          pointRadius: years.map((y) => y === year ? 5 : 2),
          pointBackgroundColor: years.map((y) => y === year ? "#93c5fd" : "transparent"),
          pointBorderColor: "#3b82f6",
          pointBorderWidth: 1.2,
          fill: true,
          tension: 0.38,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 300 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(13,27,46,0.97)",
            titleColor: "#e2e8f0",
            bodyColor: "#64748b",
            borderColor: "rgba(59,130,246,0.3)",
            borderWidth: 1, padding: 9,
            callbacks: { label: (c) => ` ${c.raw}K fines` },
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 6, color: "#475569", font: { size: 9 } } },
          y: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { callback: (v) => v + "K", color: "#475569", font: { size: 9 } }, beginAtZero: true },
        },
        // Allow clicking on chart points to change year
        onClick: (_, els) => {
          if (els.length) setYear(2008 + els[0].index);
        },
      },
    });
    return () => trendInst.current?.destroy();
  }, []);                          // Initialize only once on mount

  // ── Effect: Keep selected year synchronized with trend chart ────────────────
  // Updates the visual highlight on the trend chart when the year changes
  // without redrawing the entire chart (performance optimization)
  useEffect(() => {
    if (!trendInst.current) return;
    const ds = trendInst.current.data.datasets[0];
    // Update point sizes: larger for current year, smaller for others
    ds.pointRadius          = years.map((y) => y === year ? 5 : 2);
    ds.pointBackgroundColor = years.map((y) => y === year ? "#93c5fd" : "transparent");
    trendInst.current.update("none"); // Update without animation
  }, [year]);

  // ── Age group chart: bar chart showing distribution across age groups ───────
  // Displays what percentage of offences are committed by each age group
  useEffect(() => {
    if (!ageRef.current) return;
    ageInst.current?.destroy(); // Cleanup previous instance

    ageInst.current = new Chart(ageRef.current, {
      type: "bar",
      data: {
        labels: AGE_DATA.labels,
        datasets: [{
          data: AGE_DATA.values,
          backgroundColor: ["#0f2744","#1d4ed8","#3b82f6","#2563b0","#60a5fa"],
          borderRadius: 4,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(13,27,46,0.97)",
            titleColor: "#e2e8f0",
            bodyColor: "#64748b",
            borderColor: "rgba(59,130,246,0.3)",
            borderWidth: 1, padding: 8,
            callbacks: { label: (c) => ` ${c.raw}% of offences` },
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#475569", font: { size: 9 } } },
          y: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { callback: (v) => v + "%", color: "#475569", font: { size: 9 } }, beginAtZero: true },
        },
      },
    });
    return () => ageInst.current?.destroy();
  }, []);

  // ── Style objects shared across rendered sections ──────────────────────────
  const card = {
    padding: 16,
    borderBottom: "1px solid var(--border)",
  };

  // ── Render: Main sidebar structure ─────────────────────────────────────────
  // Displays stats, state rankings, trend chart, and age distribution

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Stat grid */}
      <div style={{ ...card }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: "Total fines",  val: tot + "K",  delta: (delta >= 0 ? "↑ " : "↓ ") + Math.abs(delta) + "%", up: delta >= 0 },
            { label: "Top state",    val: top,         delta: topPct + "% share",             up: null },
            { label: "Charges",      val: getTotal(getYearData("charges", year)) + "K",  delta: "↑ 8%",  up: true },
            { label: "Arrests",      val: getTotal(getYearData("arrests", year)) + "K",  delta: "↓ 2%",  up: false },
          ].map((s) => (
            <div key={s.label} style={{ background: "var(--card)", borderRadius: 8, padding: "11px 12px" }}>
              <div style={{ fontSize: 10, color: "var(--muted)" }}>{s.label}</div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, marginTop: 2 }}>{s.val}</div>
              <div style={{ fontSize: 10, marginTop: 2, color: s.up === null ? "var(--muted)" : s.up ? "#86efac" : "#fca5a5" }}>
                {s.delta}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* State ranking */}
      <div style={{ ...card, flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>State ranking</div>
        <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 10 }}>Click to isolate on map</div>
        {sorted.map((s) => {
          const v   = data[s] ?? 0;
          const pct = Math.round((v / max) * 100);
          return (
            <div
              key={s}
              onClick={() => setSelState(selState === s ? null : s)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                fontSize: 11, padding: "4px 6px", borderRadius: 6,
                cursor: "pointer",
                background: selState === s ? "rgba(59,130,246,0.12)" : "transparent",
              }}
            >
              <span style={{ color: "var(--muted)", width: 30, flexShrink: 0, fontSize: 10 }}>{s}</span>
              <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: pct + "%", height: "100%", borderRadius: 2, background: "var(--accent)", transition: "width 0.5s cubic-bezier(.4,0,.2,1)" }} />
              </div>
              <span style={{ fontSize: 10, color: "var(--muted)", width: 32, textAlign: "right" }}>{v}K</span>
            </div>
          );
        })}
      </div>

      {/* Trend chart */}
      <div style={{ ...card }}>
        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>National trend 2008–2024</div>
        <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 8 }}>Click a point to jump year</div>
        <div style={{ position: "relative", height: 120 }}>
          <canvas ref={trendRef} />
        </div>
      </div>

      {/* Age chart */}
      <div style={{ ...card }}>
        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>By age group</div>
        <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 8 }}>Share of total offences</div>
        <div style={{ position: "relative", height: 100 }}>
          <canvas ref={ageRef} />
        </div>
      </div>
    </div>
  );
}
