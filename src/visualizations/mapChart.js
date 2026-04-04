import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function renderMap(container, data, geoData, options = {}) {

  const year = options.year || 2024;

  d3.select(container).selectAll("*").remove();

  const width = 700;
  const height = 500;

  const svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

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

  const color = d3.scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(stateData, d => d[1])]);

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

      return rate ? color(rate) : "#ccc";
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
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .text(`Offence Rate per 100k (${year})`);
}