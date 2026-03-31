import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { width, height, margin, innerWidth, innerHeight } from "./sharedConstants.js";

export function drawScatterPlot(data) {

    // =========================
    // 1. SETUP
    // =========================
    d3.select("#scatter-container").selectAll("*").remove();

    const svg = d3.select("#scatter-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const latestYear = d3.max(data, d => d.YEAR);

    // =========================
    // 2. DATA PROCESSING
    // =========================
    data.forEach(d => {
        d.total_offences = d.FINES + d.ARRESTS + d.CHARGES;
    });

    // =========================
    // 3. COLOR SCALE
    // =========================
    const color = d3.scaleOrdinal()
        .domain([2023, 2024])
        .range(["#1f77b4", "#e63946"]);

    // =========================
    // 4. SCALES
    // =========================
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.POPULATION)])
        .range([0, innerWidth])
        .nice();

    const yScale = d3.scaleLog()
        .domain([1, d3.max(data, d => d.total_offences)])
        .range([innerHeight, 0])
        .nice();

    // =========================
    // 5. AXES
    // =========================
    chart.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale));

    chart.append("g")
        .call(d3.axisLeft(yScale));

    // =========================
    // 6. TOOLTIP
    // =========================
    d3.selectAll(".tooltip").remove();

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "white")
        .style("padding", "8px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "5px")
        .style("pointer-events", "none")
        .style("opacity", 0);

    // =========================
    // 7. POINTS
    // =========================
    chart.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.POPULATION))
        .attr("cy", d => yScale(d.total_offences))
        .attr("r", d => d.YEAR === 2023 ? 5 : 7)
        .attr("fill", d => color(d.YEAR))
        .attr("opacity", 0.75)
        .on("mouseover", function (event, d) {
            tooltip
                .style("opacity", 1)
                .html(`
                    <strong>${d.JURISDICTION} (${d.YEAR})</strong><br>
                    Population: ${d.POPULATION.toLocaleString()}<br>
                    Offences: ${d.total_offences.toLocaleString()}
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

    // =========================
    // 8. LEGEND
    // =========================
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 200}, 40)`); // move left a bit for space

    [2023, 2024].forEach((year, i) => {
        const g = legend.append("g")
            .attr("transform", `translate(${i * 80}, 0)`); // horizontal spacing

        g.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", color(year));

        g.append("text")
            .attr("x", 18)
            .attr("y", 10)
            .text(year);
    });

    // =========================
    // 9. LABELS
    // =========================
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .text("Population");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .text("Total Offences (log scale)");

    // =========================
    // 10. TITLE
    // =========================
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(`Population vs Offences (${latestYear})`);
}