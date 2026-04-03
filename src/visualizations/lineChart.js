/**
 * src/visualizations/lineChart.js
 * ─────────────────────────────────────────────────────────────────────────────
 * D3.js line chart for enforcement trend over time
 */

import { buildTrendTotals } from "../data.js";

export function renderLineChart(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  const trendData = buildTrendTotals();
  const data = trendData.map((value, i) => ({
    year: 2008 + i,
    value,
  }));

  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const width = 500 - margin.left - margin.right;
  const height = 250 - margin.top - margin.bottom;

  const svg = d3
    .create("svg")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("style", "width: 100%; height: auto;");

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3
    .scaleLinear()
    .domain([2008, 2024])
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, Math.max(...data.map((d) => d.value))])
    .range([height, 0]);

  const line = d3
    .line()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.value));

  // Grid lines
  g.append("g")
    .attr("stroke", "#253b5a")
    .attr("stroke-dasharray", "4")
    .call(
      d3.axisLeft(yScale)
        .tickSize(-width)
        .tickFormat("")
    )
    .call((g) => g.select(".domain").remove());

  // X axis
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))
    .selectAll("text")
    .attr("font-size", "11px")
    .attr("fill", "#94a3b8");

  // Y axis
  g.append("g")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .attr("font-size", "11px")
    .attr("fill", "#94a3b8");

  // Line path
  g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#3b82f6")
    .attr("stroke-width", 2)
    .attr("d", line);

  // Dots
  g.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(d.year))
    .attr("cy", (d) => yScale(d.value))
    .attr("r", 3)
    .attr("fill", "#93c5fd")
    .on("mouseover", function () {
      d3.select(this).attr("r", 5).attr("fill", "#60a5fa");
    })
    .on("mouseout", function () {
      d3.select(this).attr("r", 3).attr("fill", "#93c5fd");
    });

  container.appendChild(svg.node());
}
