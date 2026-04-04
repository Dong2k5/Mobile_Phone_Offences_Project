import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function renderMap(container, data, geoData, options = {}) {

  const year = options.year || 2024;

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

  const filtered = data.filter(d => d.YEAR === year);

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

  const projection = d3.geoMercator()
    .fitSize([width, height], geoData);

  const path = d3.geoPath().projection(projection);

  const color = d3.scaleQuantize()
    .domain([0, d3.max(stateData, d => d[1])])
    .range(d3.schemeReds[5]);

  const nameMap = {
    "NSW": "New South Wales",
    "VIC": "Victoria",
    "QLD": "Queensland",
    "WA": "Western Australia",
    "SA": "South Australia",
    "TAS": "Tasmania",
    "NT": "Northern Territory",
    "ACT": "Australian Capital Territory"
  };

  d3.select("#map-tooltip").remove();

  const tooltip = d3.select("body")
    .append("div")
    .attr("id", "map-tooltip")
    .style("position", "absolute")
    .style("background", "#fff")
    .style("padding", "6px")
    .style("border", "1px solid #ccc")
    .style("border-radius", "4px")
    .style("pointer-events", "none")
    .style("opacity", 0);

  svg.selectAll("path")
    .data(geoData.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", d => {

      const stateName = d.properties.STATE_NAME;

      const entry = Object.entries(nameMap)
        .find(([key, value]) => value === stateName);

      if (!entry) return "#ccc";

      const code = entry[0];
      const rate = rateMap.get(code);

      return rate ? color(rate) : "#cccccc";
    })
    .attr("stroke", "#333")
    .on("mouseover", function (event, d) {

      const stateName = d.properties.STATE_NAME;

      const entry = Object.entries(nameMap)
        .find(([key, value]) => value === stateName);

      if (!entry) return;

      const code = entry[0];
      const rate = rateMap.get(code);

      tooltip
        .style("opacity", 1)
        .html(`
                    <strong>${stateName}</strong><br>
                    Rate: ${rate ? rate.toFixed(1) : "N/A"} per 100k
                `);
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 20) + "px");
    })
    .on("mouseout", function () {
      tooltip.style("opacity", 0);
    });

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -5)
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .text(`Offence Rate per 100k (${year})`);

  // =========================
  // LEGEND
  // =========================
  const legendWidth = 300;
  const legendHeight = 10;

  const legend = svg.append("g")
    .attr("transform", `translate(${(width - legendWidth) / 2}, ${height + 30})`)

  // Get thresholds from scale
  const thresholds = color.thresholds();
  const colors = color.range();

  // Build legend data
  const legendData = [
    color.domain()[0],
    ...thresholds
  ];

  // Draw rectangles
  legend.selectAll("rect")
    .data(colors)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * (legendWidth / colors.length))
    .attr("y", 0)
    .attr("width", legendWidth / colors.length)
    .attr("height", legendHeight)
    .attr("fill", d => d);

  // Add labels
  legend.selectAll("text")
    .data(legendData)
    .enter()
    .append("text")
    .attr("x", (d, i) => i * (legendWidth / colors.length))
    .attr("y", legendHeight + 12)
    .style("font-size", "10px")
    .text(d => Math.round(d));

  // Legend title
  legend.append("text")
    .attr("x", legendWidth / 2)
    .attr("y", -5)
    .attr("text-anchor", "middle")
    .style("font-size", "11px")
    .style("font-weight", "bold")
    .text("Offences per 100k residents");
}