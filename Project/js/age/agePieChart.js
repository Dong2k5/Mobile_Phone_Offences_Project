import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { width, height } from "../sharedConstants.js";

export function drawAgePie(data, selectedAge, selectedTypes = ["fines", "arrests", "charges"]) {

    d3.select("#age-pie-container").selectAll("*").remove();

    const svg = d3.select("#age-pie-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const radius = Math.min(width, height) / 3;

    const chart = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // =========================
    // 1. FILTER DATA
    // =========================
    const filtered = data.filter(d => d.AGE_GROUP === selectedAge);

    const allTotals = {
        fines: d3.sum(filtered, d => d.FINES),
        arrests: d3.sum(filtered, d => d.ARRESTS),
        charges: d3.sum(filtered, d => d.CHARGES)
    };

    if (selectedTypes.length === 0) {
        return;
    }
    const pieData = selectedTypes.map(key => ({
        key,
        value: allTotals[key] || 0
    }));

    // =========================
    // 2. PIE + ARC
    // =========================
    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const color = d3.scaleOrdinal()
        .domain(["fines", "arrests", "charges"])
        .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

    // =========================
    // 3. TOOLTIP
    // =========================
    d3.selectAll(".tooltip").remove();

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("padding", "6px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("opacity", 0);

    // =========================
    // 4. DRAW
    // =========================
    chart.selectAll("path")
        .data(pie(pieData))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.key))
        .attr("stroke", "#fff")
        .style("stroke-width", "2px")
        .on("mouseover", function (event, d) {

            const total = d3.sum(pieData, d => d.value);
            const percent = ((d.data.value / total) * 100).toFixed(1);

            tooltip
                .style("opacity", 1)
                .html(`
                    <strong>${selectedAge}</strong><br>
                    Type: ${d.data.key}<br>
                    Count: ${d.data.value.toLocaleString()}<br>
                    Percentage: ${percent}%
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
    // 5. TITLE
    // =========================
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(`Enforcement Breakdown (${selectedAge})`);

    // =========================
    // 6. LEGEND
    // =========================
    const legend = svg.append("g")
        .attr("transform", `translate(${width / 2 - 120}, ${height - 50})`);

    ["fines", "arrests", "charges"].forEach((key, i) => {
        const g = legend.append("g")
            .attr("transform", `translate(${i * 100}, 0)`);

        g.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", color(key));

        g.append("text")
            .attr("x", 18)
            .attr("y", 10)
            .text(key);
    });
}