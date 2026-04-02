import React, { useState, useCallback } from "react";
// ── Data utilities: functions to retrieve enforcement data by state ──────────
import { getYearData, valueToColor, STATE_NAMES } from "../data/enforcement.js";

/**
 * AustraliaMap Component
 * ─────────────────────────────────────────────────────────────────────────────
 * Interactive SVG map of Australia showing enforcement data for each state/territory.
 * Features:
 * - Color intensity represents enforcement volume (darker = more enforcement)
 * - Hover for tooltip showing detailed statistics
 * - Click state to isolate on map for focused analysis
 * - Year and action type filters applied dynamically
 *
 * @param {number} year - Current year for filtering data
 * @param {string} actionType - Type of enforcement ("fines", "charges", "arrests")
 * @param {string} selState - Currently selected state (highlighted)
 * @param {Function} setSelState - Updates selected state
 */

// ── SVG State Definitions ────────────────────────────────────────────────────
// Defines geographic shapes for each state/territory with positioning and labels
// Each entry includes: id, SVG shape type (path/rect), label coordinates, font size
const STATE_SHAPES = [
  {
    id: "WA",
    type: "path",
    d: "M 60,80 L 60,480 L 310,480 L 310,320 L 270,280 L 270,80 Z",
    labelX: 175, labelY: 290, fontSize: 18,
  },
  {
    id: "NT",
    type: "path",
    d: "M 270,80 L 270,280 L 390,280 L 390,80 Z",
    labelX: 330, labelY: 185, fontSize: 14,
  },
  {
    id: "SA",
    type: "path",
    d: "M 270,280 L 310,480 L 460,480 L 490,400 L 490,280 L 390,280 Z",
    labelX: 385, labelY: 395, fontSize: 15,
  },
  {
    id: "QLD",
    type: "path",
    d: "M 390,80 L 390,280 L 490,280 L 490,180 L 610,180 L 610,80 Z",
    labelX: 495, labelY: 145, fontSize: 16,
  },
  {
    id: "NSW",
    type: "path",
    d: "M 490,180 L 490,400 L 560,430 L 650,390 L 680,330 L 680,180 L 610,180 Z",
    labelX: 580, labelY: 300, fontSize: 15,
  },
  {
    id: "VIC",
    type: "path",
    d: "M 460,480 L 490,400 L 560,430 L 650,390 L 650,460 L 590,500 L 490,500 Z",
    labelX: 555, labelY: 458, fontSize: 14,
  },
  {
    id: "ACT",
    type: "rect",
    x: 570, y: 360, width: 30, height: 24, rx: 4,
    labelX: 585, labelY: 376, fontSize: 8,
  },
  {
    id: "TAS",
    type: "path",
    d: "M 570,530 L 590,510 L 630,515 L 645,545 L 620,570 L 580,565 Z",
    labelX: 607, labelY: 543, fontSize: 11,
  },
];

// ── AustraliaMap Component ────────────────────────────────────────────────────
// Renders an interactive map with SVG shapes for each state/territory
export default function AustraliaMap({ year, actionType, selState, setSelState }) {
  // ── Tooltip state: displays hover information ─────────────────────────────
  // { name, fines, change, x, y } or null if not hovering
  const [tooltip, setTooltip] = useState(null);

  // ── Data fetching: gets enforcement data for current selection ────────────
  const data     = getYearData(actionType, year);        // Current year data
  const prevData = getYearData(actionType, year - 1);    // Previous year data (for comparison)
  const max      = Math.max(...Object.values(data), 1);  // Maximum value for color scaling

  // ── Event handler: Shows tooltip on mouse enter with state details ───────
  // Calculates year-over-year change percentage
  const handleMouseEnter = useCallback(
    (e, id) => {
      const v  = data[id]    ?? 0;          // Current year value
      const pv = prevData[id] ?? 0;         // Previous year value
      const chg = pv ? Math.round(((v - pv) / pv) * 100) : 0; // YoY change %
      setTooltip({
        name:   STATE_NAMES[id] ?? id,
        fines:  v + "K",
        change: (chg >= 0 ? "+" : "") + chg + "%",
        x: e.clientX + 14,
        y: e.clientY - 10,
      });
    },
    [data, prevData]
  );

  // ── Event handler: Updates tooltip position while hovering ────────────────
  const handleMouseMove = useCallback((e) => {
    setTooltip((t) => t ? { ...t, x: e.clientX + 14, y: e.clientY - 10 } : t);
  }, []);

  // ── Event handler: Clears tooltip when mouse leaves ─────────────────────
  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  // ── Event handler: Toggles state selection on click ──────────────────────
  // Clicking the same state again deselects it
  const handleClick = useCallback(
    (id) => setSelState((prev) => (prev === id ? null : id)),
    [setSelState]
  );

  return (
    <>
      {/* Tooltip */}
      {tooltip && (
        <div
          className="map-tooltip"
          style={{ left: tooltip.x, top: tooltip.y, opacity: 1 }}
        >
          <div style={{ fontWeight: 500, fontSize: 12, color: "var(--text)", marginBottom: 3 }}>
            {tooltip.name}
          </div>
          <div style={{ color: "var(--muted)", marginTop: 1, fontSize: 11 }}>
            Fines: <span style={{ color: "var(--light)" }}>{tooltip.fines}</span>
          </div>
          <div style={{ color: "var(--muted)", marginTop: 1, fontSize: 11 }}>
            Year-on-year: <span style={{ color: "var(--light)" }}>{tooltip.change}</span>
          </div>
        </div>
      )}

      <svg viewBox="0 0 800 600" width="100%" xmlns="http://www.w3.org/2000/svg">
        {STATE_SHAPES.map(({ id, type, labelX, labelY, fontSize, ...shapeProps }) => {
          const fill    = valueToColor(data[id] ?? 0, max);
          const dimmed  = selState && selState !== id;
          const selected = selState === id;

          const commonProps = {
            fill,
            className: [
              "map-path",
              dimmed   ? "dimmed"   : "",
              selected ? "selected" : "",
            ]
              .join(" ")
              .trim(),
            onMouseEnter: (e) => handleMouseEnter(e, id),
            onMouseMove:  handleMouseMove,
            onMouseLeave: handleMouseLeave,
            onClick:      () => handleClick(id),
          };

          return (
            <g key={id}>
              {type === "path" ? (
                <path d={shapeProps.d} {...commonProps} />
              ) : (
                <rect
                  x={shapeProps.x}
                  y={shapeProps.y}
                  width={shapeProps.width}
                  height={shapeProps.height}
                  rx={shapeProps.rx}
                  {...commonProps}
                />
              )}
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                fontSize={fontSize}
                fontWeight="500"
                fill="rgba(255,255,255,0.85)"
                fontFamily="DM Sans, sans-serif"
                pointerEvents="none"
                style={{ opacity: dimmed ? 0.3 : 1, transition: "opacity 0.25s" }}
              >
                {id}
              </text>
            </g>
          );
        })}
      </svg>
    </>
  );
}
