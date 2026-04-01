import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { width, height, margin, innerWidth, innerHeight } from "./sharedConstants.js";

export function drawRankChange(data) {

    d3.select("#rank-container").selectAll("*").remove();

    const svg = d3.select("#rank-container")
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
            const total = d3.sum(v, d => d.FINES + d.ARRESTS + d.CHARGES);
            const population = d3.mean(v, d => d.POPULATION);

            return {
                total: total,
                rate: (total / population) * 100000
            };
        },
        d => d.JURISDICTION
    );

    const formatted = grouped.map(([state, val]) => ({
        state,
        total: val.total,
        rate: val.rate
    }));

    // =========================
    // 2. CREATE RANKS
    // =========================
    const totalRank = [...formatted].sort((a, b) => d3.descending(a.total, b.total));
    totalRank.forEach((d, i) => d.rankTotal = i + 1);

    const rateRank = [...formatted].sort((a, b) => d3.descending(a.rate, b.rate));
    rateRank.forEach((d, i) => d.rankRate = i + 1);

    // merge
    const finalData = totalRank.map(d => {
        const match = rateRank.find(r => r.state === d.state);

        const rankTotal = d.rankTotal;
        const rankRate = match.rankRate;

        return {
            state: d.state,
            rankTotal,
            rankRate,
            rankDiff: rankRate - rankTotal   // ⭐ ADD THIS
        };
    });

    // =========================
    // 3. SCALES
    // =========================
    const x0 = d3.scaleBand()
        .domain(finalData.map(d => d.state))
        .range([0, innerWidth])
        .padding(0.2);

    const x1 = d3.scaleBand()
        .domain(["Total", "Per100k"])
        .range([0, x0.bandwidth()])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(finalData, d => Math.max(d.rankTotal, d.rankRate))])
        .range([0, innerHeight]);

    const color = d3.scaleOrdinal()
        .domain(["Total", "Per100k"])
        .range(["#1f77b4", "#e45756"]);

    // =========================
    // 4. DRAW BARS
    // =========================
    chart.selectAll("g.state")
        .data(finalData)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${x0(d.state)}, 0)`)
        .selectAll("rect")
        .data(d => [
            { key: "Total", value: d.rankTotal, full: d },
            { key: "Per100k", value: d.rankRate, full: d }
        ])
        .enter()
        .append("rect")
        .attr("x", d => x1(d.key))
        .attr("y", d => innerHeight - yScale(d.value))
        .attr("width", x1.bandwidth())
        .attr("height", d => yScale(d.value))
        .attr("fill", d => color(d.key))
        .data(d => [
            { key: "Total", value: d.rankTotal, full: d },
            { key: "Per100k", value: d.rankRate, full: d }
        ])
        .on("mousemove", function (event) {
            tooltip
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function () {
            tooltip.style("opacity", 0);
        });

    // =========================
    // 5. AXES
    // =========================
    chart.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(x0));

    chart.append("g")
        .call(
            d3.axisLeft(
                d3.scaleLinear()
                    .domain([0, d3.max(finalData, d => Math.max(d.rankTotal, d.rankRate))])
                    .range([innerHeight, 0])
            )
        );

    // =========================
    // 6. LEGEND
    // =========================
    const legend = svg.append("g")
        .attr("transform", `translate(${width / 2 - 100}, 50)`);

    ["Total", "Per100k"].forEach((key, i) => {
        const g = legend.append("g")
            .attr("transform", `translate(${i * 120}, 0)`);

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
    // 7. TITLE
    // =========================
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .text("Jurisdiction");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text("Rank Comparison: Total vs Normalized");

    // =========================
    // 8. TOOLTIP
    // =========================
    d3.selectAll(".tooltip").remove();

    const tooltip = d3.select("#rank-container")
        .append("div")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("padding", "5px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("opacity", 0);

}