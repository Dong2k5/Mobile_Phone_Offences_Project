/**
 * src/visualizations/barChart.js
 * ─────────────────────────────────────────────────────────────────────────────
 * D3.js bar chart showing state-by-state enforcement comparison
 */

import { getYearData, STATES, STATE_NAMES } from "../data.js";

export function renderBarChart(containerId, year, actionType, selectedState) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  const yearData = getYearData(actionType, year);
  const data = STATES.map((state) => ({
    state,
    value: yearData[state] || 0,
    name: STATE_NAMES[state],
  })).sort((a, b) => b.value - a.value);

  const margin = { top: 20, right: 20, bottom: 60, left: 50 };
  const width = 500 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const svg = d3
    .create("svg")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("style", "width: 100%; height: auto;");

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.state))
    .range([0, width])
    .padding(0.3);

  const yScale = d3
    .scaleLinear()
    .domain([0, Math.max(...data.map((d) => d.value))])
    .range([height, 0]);

  // X axis
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("font-size", "11px")
    .attr("fill", "#94a3b8");

  // Y axis
  g.append("g")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .attr("font-size", "11px")
    .attr("fill", "#94a3b8");

  // Bars
  g.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", (d) => `bar ${selectedState === d.state ? "selected" : ""}`)
    .attr("x", (d) => xScale(d.state))
    .attr("y", (d) => yScale(d.value))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - yScale(d.value))
    .attr("fill", (d) => (selectedState === d.state ? "#93c5fd" : "#3b82f6"))
    .attr("opacity", (d) => (selectedState && selectedState !== d.state ? 0.3 : 1))
    .on("mouseover", function () {
      d3.select(this).attr("fill", "#93c5fd");
    })
    .on("mouseout", function (d) {
      d3.select(this).attr("fill", selectedState === d.state ? "#93c5fd" : "#3b82f6");
    });

  container.appendChild(svg.node());
}
