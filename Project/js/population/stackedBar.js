import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { width, height, margin, innerWidth, innerHeight } from "../sharedConstants.js";

export function drawStackedBar(data, selectedTypes = ["fines", "arrests", "charges"]) {
    d3.select("#stacked-container").selectAll("*").remove();

    const svg = d3.select("#stacked-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // =========================
    // 1. AGGREGATE DATA
    // =========================
    const grouped = d3.rollups(
        data,
        v => {
            const fines = d3.sum(v, d => d.FINES);
            const arrests = d3.sum(v, d => d.ARRESTS);
            const charges = d3.sum(v, d => d.CHARGES);
            const total = fines + arrests + charges;

            const values = {
                fines: fines,
                arrests: arrests,
                charges: charges
            };

            // calculate total ONLY for selected types
            const selectedTotal = selectedTypes.reduce((sum, key) => sum + values[key], 0);

            const result = {};
            selectedTypes.forEach(key => {
                result[key] = selectedTotal === 0 ? 0 : values[key] / selectedTotal;
            });

            return result;
        },
        d => d.JURISDICTION
    );

    const formatted = grouped.map(([key, value]) => ({
        state: key,
        ...value
    }));

    // =========================
    // 2. STACK SETUP
    // =========================
    const keys = selectedTypes;

    const stack = d3.stack().keys(keys);

    const stackedData = stack(formatted);

    // =========================
    // 3. SCALES
    // =========================
    const xScale = d3.scaleBand()
        .domain(formatted.map(d => d.state))
        .range([0, innerWidth])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, 1]) // percentage
        .range([innerHeight, 0]);

    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

    // =========================
    // 4. AXES
    // =========================
    chart.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale));

    chart.append("g")
        .call(d3.axisLeft(yScale).tickFormat(d3.format(".0%")));

    // =========================
    // 5. DRAW STACKED BARS
    // =========================
    chart.selectAll("g.layer")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.data.state))
        .attr("y", d => yScale(d[1]))
        .attr("height", d => yScale(d[0]) - yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .on("mouseover", function (event, d) {

            const type = d3.select(this.parentNode).datum().key;
            const value = d.data[type];

            tooltip
                .style("opacity", 1)
                .html(`
            <strong>${d.data.state}</strong><br>
            Type: ${type}<br>
            Percentage: ${(value * 100).toFixed(1)}%
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
    // 6. LEGEND
    // =========================
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 300}, 40)`);

    keys.forEach((key, i) => {
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

    // =========================
    // 7. LABELS
    // =========================
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .text("Jurisdiction");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .text("Proportion of Enforcement");

    // =========================
    // 8. TITLE
    // =========================
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Enforcement Strategy by Jurisdiction");

    // =========================
    // 9. TOOLTIP
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
}