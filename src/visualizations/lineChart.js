// src/visualizations/lineChart.js
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

/**
 * Multi-line Chart:
 * Trend by AGE GROUP over time
 * @param {string} container - DOM selector
 * @param {Array} data - dataset
 * @param {Object} [config] - optional config { age: "17-25" }
 */
export function renderLineChart(container, data, config = {}) {

    d3.select(container).selectAll("*").remove();

    const selectedAge = config.age; // optional

    const margin = { top: 50, right: 100, bottom: 50, left: 70 };
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // =========================
    // FILTER DATA
    // =========================
    let filteredData = data;
    if (selectedAge) {
        filteredData = data.filter(d => d.AGE_GROUP === selectedAge);
    }

    // =========================
    // AGGREGATE
    // =========================
    const grouped = d3.groups(filteredData, d => d.AGE_GROUP);

    const processed = grouped.map(([age, values]) => ({
        age,
        values: d3.rollups(
            values,
            v => d3.sum(v, d => d.FINES + d.ARRESTS + d.CHARGES),
            d => d.YEAR
        )
            .map(([year, value]) => ({ year: +year, value }))
            .sort((a, b) => a.year - b.year)
    }));

    const allYears = [...new Set(data.map(d => d.YEAR))];

    // =========================
    // SCALES
    // =========================
    const x = d3.scalePoint()
        .domain(allYears)
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([
            0,
            d3.max(processed, g => d3.max(g.values, d => d.value))
        ])
        .nice()
        .range([height, 0]);

    const color = d3.scaleOrdinal(d3.schemeTableau10);

    // =========================
    // AXES
    // =========================
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    // =========================
    // TOOLTIP
    // =========================
    d3.select("#line-tooltip").remove();

    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "line-tooltip")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("padding", "6px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("opacity", 0);

    // =========================
    // DRAW LINES
    // =========================
    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.value))
        .curve(d3.curveMonotoneX);

    processed.forEach(group => {

        svg.append("path")
            .datum(group.values)
            .attr("fill", "none")
            .attr("stroke", color(group.age))
            .attr("stroke-width", 2)
            .attr("d", line);

        // dots
        svg.selectAll(`.dot-${group.age}`)
            .data(group.values)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.year))
            .attr("cy", d => y(d.value))
            .attr("r", 4)
            .attr("fill", color(group.age))
            .on("mouseover", (event, d) => {
                tooltip
                    .style("opacity", 1)
                    .html(`
                        <strong>${group.age}</strong><br>
                        Year: ${d.year}<br>
                        Offences: ${d.value.toLocaleString()}
                    `);
            })
            .on("mousemove", event => {
                tooltip
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 20) + "px");
            })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });
    });

    // =========================
    // LEGEND (RIGHT SIDE)
    // =========================
    const legend = svg.append("g")
        .attr("transform", `translate(${width + 10}, 0)`);

    processed.forEach((g, i) => {
        const item = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);

        item.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", color(g.age));

        item.append("text")
            .attr("x", 15)
            .attr("y", 10)
            .style("font-size", "11px")
            .style("fill", "var(--text)")
            .text(g.age);
    });

    // =========================
    // TITLE
    // =========================
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -15)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("fill", "var(--text)")
        .text("Offence Trends by Age Group (2023–2024)");
}