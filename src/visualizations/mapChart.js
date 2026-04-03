/**
 * src/visualizations/mapChart.js
 * ─────────────────────────────────────────────────────────────────────────────
 * D3.js-based Australia map with interactive state highlighting
 * Color-codes states by enforcement intensity
 */

import { getYearData, getTotal, valueToColor, STATES, STATE_NAMES } from "../data.js";

const STATE_SHAPES = [
  { id: "WA", type: "path", d: "M 60,80 L 60,480 L 310,480 L 310,320 L 270,280 L 270,80 Z", labelX: 175, labelY: 290, fontSize: 18 },
  { id: "NT", type: "path", d: "M 270,80 L 270,280 L 390,280 L 390,80 Z", labelX: 330, labelY: 185, fontSize: 14 },
  { id: "SA", type: "path", d: "M 270,280 L 310,480 L 460,480 L 490,400 L 490,280 L 390,280 Z", labelX: 385, labelY: 395, fontSize: 15 },
  { id: "QLD", type: "path", d: "M 390,80 L 390,280 L 490,280 L 490,180 L 610,180 L 610,80 Z", labelX: 495, labelY: 145, fontSize: 16 },
  { id: "NSW", type: "path", d: "M 490,180 L 490,400 L 560,430 L 650,390 L 680,330 L 680,180 L 610,180 Z", labelX: 580, labelY: 300, fontSize: 15 },
  { id: "VIC", type: "path", d: "M 460,480 L 490,400 L 560,430 L 650,390 L 650,460 L 590,500 L 490,500 Z", labelX: 555, labelY: 458, fontSize: 14 },
  { id: "ACT", type: "rect", x: 570, y: 360, width: 30, height: 24, rx: 4, labelX: 585, labelY: 376, fontSize: 8 },
  { id: "TAS", type: "path", d: "M 570,530 L 590,510 L 630,515 L 645,545 L 620,570 L 580,565 Z", labelX: 607, labelY: 543, fontSize: 11 },
];

export function renderMap(containerId, year, actionType, onStateSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  const yearData = getYearData(actionType, year);
  const maxValue = Math.max(...Object.values(yearData));

  const svg = d3
    .create("svg")
    .attr("viewBox", "0 0 750 600")
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("style", "width: 100%; height: auto; max-width: 600px; display: block; margin: 0 auto;");

  // Draw state paths
  STATE_SHAPES.forEach((shape) => {
    const value = yearData[shape.id] || 0;
    const color = valueToColor(value, maxValue);

    let element;
    if (shape.type === "path") {
      element = svg
        .append("path")
        .attr("d", shape.d)
        .attr("class", "state-path")
        .attr("data-state", shape.id)
        .attr("fill", color);
    } else if (shape.type === "rect") {
      element = svg
        .append("rect")
        .attr("x", shape.x)
        .attr("y", shape.y)
        .attr("width", shape.width)
        .attr("height", shape.height)
        .attr("rx", shape.rx)
        .attr("class", "state-path")
        .attr("data-state", shape.id)
        .attr("fill", color);
    }

    // Add interactivity
    element
      .on("mouseenter", function () {
        const state = shape.id;
        const val = yearData[state];
        showTooltip(state, val, actionType, d3.event);
      })
      .on("mouseleave", hideTooltip)
      .on("click", function () {
        onStateSelect?.(shape.id);
      });

    // Add state label text
    svg
      .append("text")
      .attr("x", shape.labelX)
      .attr("y", shape.labelY)
      .attr("font-size", shape.fontSize)
      .attr("font-weight", "600")
      .attr("fill", "#e2e8f0")
      .attr("text-anchor", "middle")
      .attr("pointer-events", "none")
      .text(shape.id);
  });

  container.appendChild(svg.node());
}

function showTooltip(state, value, actionType, event) {
  if (!event) return;

  const actionLabel = {
    fines: "Fines",
    charges: "Charges",
    arrests: "Arrests",
  }[actionType];

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "map-tooltip")
    .attr("id", "tooltip")
    .style("left", event.clientX + 10 + "px")
    .style("top", event.clientY + 10 + "px")
    .html(`<strong>${state}</strong><br/>${actionLabel}: ${value.toFixed(1)}K`);

  document.addEventListener("mousemove", (e) => {
    if (document.getElementById("tooltip")) {
      tooltip.style("left", e.clientX + 10 + "px").style("top", e.clientY + 10 + "px");
    }
  });
}

function hideTooltip() {
  d3.select("#tooltip").remove();
}
