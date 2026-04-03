/**
 * src/visualizations/pieChart.js
 * ─────────────────────────────────────────────────────────────────────────────
 * D3.js pie chart for age group distribution
 */

import { AGE_DATA } from "../data.js";

export function renderPieChart(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  const data = AGE_DATA.labels.map((label, i) => ({
    label,
    value: AGE_DATA.values[i],
  }));

  const width = 350;
  const height = 350;
  const radius = Math.min(width, height) / 2 - 40;

  const svg = d3
    .create("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("style", "width: 100%; height: auto;");

  const g = svg
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.label))
    .range(["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"]);

  const pie = d3.pie().value((d) => d.value);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  const paths = g
    .selectAll("path")
    .data(pie(data))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.label))
    .attr("class", "pie-slice")
    .on("mouseover", function (d) {
      d3.select(this).attr("opacity", 0.7);
    })
    .on("mouseout", function () {
      d3.select(this).attr("opacity", 1);
    });

  // Add labels
  g.selectAll("text")
    .data(pie(data))
    .enter()
    .append("text")
    .attr("transform", (d) => `translate(${arc.centroid(d)})`)
    .attr("dy", "0.35em")
    .attr("font-size", "12px")
    .attr("font-weight", "600")
    .attr("fill", "#e2e8f0")
    .attr("text-anchor", "middle")
    .attr("pointer-events", "none")
    .text((d) => `${d.data.value}%`);

  // Add legend
  const legend = svg
    .append("g")
    .attr("transform", `translate(20, ${height - 100})`);

  legend
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => (i % 2) * 170)
    .attr("y", (d, i) => Math.floor(i / 2) * 25)
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", (d) => color(d.label))
    .attr("rx", 3);

  legend
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", (d, i) => (i % 2) * 170 + 25)
    .attr("y", (d, i) => Math.floor(i / 2) * 25 + 12)
    .attr("font-size", "11px")
    .attr("fill", "#94a3b8")
    .text((d) => `${d.label}: ${d.value}%`);

  container.appendChild(svg.node());
}
