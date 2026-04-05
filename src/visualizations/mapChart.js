import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { MAP_SHADES } from "../data.js"; // path to MAP_SHADES

export function renderMap(container, data, geoData, options = {}) {
  const year = options.year || 2024;
  const actionType = options.actionType || "fines";
  const onStateSelect = options.onStateSelect;

  // Clear previous content
  d3.select(container).selectAll("*").remove();

  const margin = { top: 40, right: 20, bottom: 80, left: 20 };
  const width = 700 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const svg = d3.select(container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Get theme colors
  const root = getComputedStyle(document.documentElement);
  const accent = root.getPropertyValue('--accent').trim();
  const light = root.getPropertyValue('--light').trim();
  const sub = root.getPropertyValue('--sub').trim();
  const border = root.getPropertyValue('--border').trim();
  const panel = root.getPropertyValue('--panel').trim();
  const textColor = root.getPropertyValue('--text').trim();

  // Filter data for the selected year
  const filtered = data.filter(d => d.YEAR === year);

  // Rollup data by state code
  const stateData = d3.rollups(
    filtered,
    v => {
      const totalOffences = d3.sum(v, d => d.FINES + d.ARRESTS + d.CHARGES);
      const totalPopulation = d3.sum(v, d => d.POPULATION);
      return (totalOffences / totalPopulation) * 100000;
    },
    d => d.JURISDICTION
  );
  const rateMap = new Map(stateData);

  // Abbreviation → Full name mapping
  const nameMap = {
    NSW: "New South Wales",
    VIC: "Victoria",
    QLD: "Queensland",
    WA: "Western Australia",
    SA: "South Australia",
    TAS: "Tasmania",
    NT: "Northern Territory",
    ACT: "Australian Capital Territory"
  };

  // Projection & path
  const projection = d3.geoMercator().fitSize([width, height], geoData);
  const path = d3.geoPath().projection(projection);

  // Quantized color scale using MAP_SHADES
  const maxRate = d3.max(stateData, d => d[1]) || 1;
  const colorScale = d3.scaleQuantize()
    .domain([0, maxRate])
    .range(MAP_SHADES);

  // Tooltip
  d3.select("#map-tooltip").remove();
  const tooltip = d3.select("body")
    .append("div")
    .attr("id", "map-tooltip")
    .style("position", "absolute")
    .style("background", panel)
    .style("padding", "6px")
    .style("border", `1px solid ${border}`)
    .style("border-radius", "4px")
    .style("color", textColor)
    .style("pointer-events", "none")
    .style("opacity", 0);

  // Draw states
  svg.selectAll("path")
    .data(geoData.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", d => {
      const entry = Object.entries(nameMap).find(([code, name]) => name === d.properties.STATE_NAME);
      const rate = entry ? rateMap.get(entry[0]) : 0;
      return rate ? colorScale(rate) : light;
    })
    .attr("stroke", border)
    .attr("stroke-width", 0.8)
    .on("mouseover", function (event, d) {
      const entry = Object.entries(nameMap).find(([code, name]) => name === d.properties.STATE_NAME);
      if (!entry) return;
      const code = entry[0];
      const rate = rateMap.get(code);
      tooltip
        .style("opacity", 1)
        .html(`<strong>${d.properties.STATE_NAME} (${code})</strong><br>Rate: ${rate ? rate.toFixed(1) : "N/A"} per 100k`);
      d3.select(this).attr("stroke", textColor).attr("stroke-width", 2);
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 20) + "px");
    })
    .on("mouseout", function () {
      tooltip.style("opacity", 0);
      d3.select(this).attr("stroke", border).attr("stroke-width", 0.8);
    })
    .on("click", function (event, d) {
      const entry = Object.entries(nameMap).find(([code, name]) => name === d.properties.STATE_NAME);
      if (!entry) return;
      const code = entry[0];
      onStateSelect?.(code);
    });

  // State labels
  svg.selectAll("text.state-label")
    .data(geoData.features)
    .enter()
    .append("text")
    .attr("class", "state-label")
    .attr("x", d => path.centroid(d)[0])
    .attr("y", d => path.centroid(d)[1])
    .attr("text-anchor", "middle")
    .attr("font-size", 12)
    .attr("font-weight", "600")
    .attr("fill", textColor)
    .text(d => {
      const entry = Object.entries(nameMap).find(([code, name]) => name === d.properties.STATE_NAME);
      return entry ? entry[0] : "";
    });

  // Map title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -5)
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("fill", textColor)
    .text(`Offence Rate per 100k (${year})`);

  // Legend
  const legendWidth = 300;
  const legendHeight = 12;
  const legend = svg.append("g")
    .attr("transform", `translate(${(width - legendWidth) / 2}, ${height + 40})`);

  const thresholds = colorScale.thresholds ? colorScale.thresholds() : d3.range(0, maxRate, maxRate / MAP_SHADES.length);

  legend.selectAll("rect")
    .data(MAP_SHADES)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * (legendWidth / MAP_SHADES.length))
    .attr("y", 0)
    .attr("width", legendWidth / MAP_SHADES.length)
    .attr("height", legendHeight)
    .attr("fill", d => d)
    .attr("stroke", border)
    .attr("stroke-width", 0.5);

  legend.selectAll("text")
    .data([0, ...thresholds])
    .enter()
    .append("text")
    .attr("x", (d, i) => i * (legendWidth / MAP_SHADES.length))
    .attr("y", legendHeight + 12)
    .style("font-size", "10px")
    .style("fill", sub)
    .text(d => Math.round(d));

  legend.append("text")
    .attr("x", legendWidth / 2)
    .attr("y", -6)
    .attr("text-anchor", "middle")
    .style("font-size", "11px")
    .style("font-weight", "bold")
    .style("fill", textColor)
    .text("Offences per 100k residents");
}