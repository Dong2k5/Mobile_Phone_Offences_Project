import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

/**
 * Dual Axis Chart:
 * - Bars → Total fines
 * - Line → Fines per 100k residents
 */
export function renderDualAxisBar(container, data, options = {}) {

    const year = options.year || 2024;

    // =========================
    // CLEAR CONTAINER
    // =========================
    d3.select(container).selectAll("*").remove();

    // =========================
    // SETUP
    // =========================
    const margin = { top: 50, right: 60, bottom: 50, left: 70 };
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
    const filtered = data.filter(d => d.YEAR === year);

    // =========================
    // AGGREGATE BY STATE
    // =========================
    const stateData = d3.rollups(
        filtered,
        v => {
            const totalFines = d3.sum(v, d => d.FINES);
            const totalPop = d3.sum(v, d => d.POPULATION);

            return {
                total: totalFines,
                rate: (totalFines / totalPop) * 100000
            };
        },
        d => d.JURISDICTION
    ).map(([state, values]) => ({
        state,
        total: values.total,
        rate: values.rate
    }));

    // Sort by total fines (optional but cleaner)
    stateData.sort((a, b) => b.total - a.total);

    // =========================
    // SCALES
    // =========================
    const x = d3.scaleBand()
        .domain(stateData.map(d => d.state))
        .range([0, width])
        .padding(0.2);

    const yLeft = d3.scaleLinear()
        .domain([0, d3.max(stateData, d => d.total)])
        .nice()
        .range([height, 0]);

    const yRight = d3.scaleLinear()
        .domain([0, d3.max(stateData, d => d.rate)])
        .nice()
        .range([height, 0]);

    // =========================
    // AXES
    // =========================
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(yLeft));

    svg.append("g")
        .attr("transform", `translate(${width},0)`)
        .call(d3.axisRight(yRight));

    // =========================
    // TOOLTIP
    // =========================
    d3.select("#dual-tooltip").remove();

    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "dual-tooltip")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("padding", "6px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("opacity", 0);

    // =========================
    // DRAW BARS (TOTAL FINES)
    // =========================
    svg.selectAll(".bar")
        .data(stateData)
        .enter()
        .append("rect")
        .attr("x", d => x(d.state))
        .attr("y", d => yLeft(d.total))
        .attr("width", x.bandwidth())
        .attr("height", d => height - yLeft(d.total))
        .attr("fill", "#3b82f6")
        .on("mouseover", function (event, d) {
            tooltip
                .style("opacity", 1)
                .html(`
        <strong>${d.state}</strong><br>
        <span style="color:#3b82f6;">● Total fines:</span> ${d.total.toLocaleString()}<br>
        <span style="color:#ef4444;">● Rate:</span> ${d.rate.toFixed(1)} per 100k
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
    // DRAW LINE (RATE)
    // =========================
    const line = d3.line()
        .x(d => x(d.state) + x.bandwidth() / 2)
        .y(d => yRight(d.rate));

    svg.append("path")
        .datum(stateData)
        .attr("fill", "none")
        .attr("stroke", "#ef4444")
        .attr("stroke-width", 2)
        .attr("d", line);

    // Add points
    svg.selectAll(".dot")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.state) + x.bandwidth() / 2)
        .attr("cy", d => yRight(d.rate))
        .attr("r", 5)
        .attr("fill", "#ef4444")
        .on("mouseover", function (event, d) {
            tooltip
                .style("opacity", 1)
                .html(`
        <strong>${d.state}</strong><br>
        <span style="color:#ef4444;">● Rate:</span> ${d.rate.toFixed(1)} per 100k<br>
        <span style="color:#3b82f6;">● Total fines:</span> ${d.total.toLocaleString()}
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
    // TITLE
    // =========================
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -15)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(`Total Fines vs Rate per 100k (${year})`);

    // =========================
    // AXIS LABELS
    // =========================
    svg.append("text")
        .attr("x", -40)
        .attr("y", -10)
        .style("font-size", "12px")
        .text("Total Fines");

    svg.append("text")
        .attr("x", width - 40)
        .attr("y", -10)
        .style("font-size", "12px")
        .text("Rate per 100k");
}