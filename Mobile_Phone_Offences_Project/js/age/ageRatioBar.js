import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { width, height, margin, innerWidth, innerHeight } from "../sharedConstants.js";

export function drawAgeRatioBar(data) {

    d3.select("#age-ratio-container").selectAll("*").remove();

    const svg = d3.select("#age-ratio-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // =========================
    // 1. AGGREGATE
    // =========================
    const grouped = d3.rollups(
        data,
        v => ({
            offences: d3.sum(v, d => d.FINES + d.ARRESTS + d.CHARGES),
            population: d3.sum(v, d => d.POPULATION)
        }),
        d => d.AGE_GROUP
    );

    let formatted = grouped.map(([age, val]) => ({
        age,
        offences: val.offences,
        population: val.population
    }));

    // =========================
    // 2. CALCULATE %
    // =========================
    const totalOffences = d3.sum(formatted, d => d.offences);
    const totalPopulation = d3.sum(formatted, d => d.population);

    formatted = formatted.map(d => {
        const offencePct = d.offences / totalOffences;
        const populationPct = d.population / totalPopulation;

        return {
            age: d.age,
            ratio: populationPct === 0 ? 0 : offencePct / populationPct
        };
    });

    // =========================
    // 3. SORT (optional but nice)
    // =========================
    formatted.sort((a, b) => d3.descending(a.ratio, b.ratio));

    // =========================
    // 4. SCALES
    // =========================
    const ageOrder = ["0-16", "17-25", "26-39", "40-64", "65 and over"];

    const xScale = d3.scaleBand()
        .domain(ageOrder.filter(age => formatted.some(d => d.age === age))).range([0, innerWidth])
        .padding(0.3);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(formatted, d => d.ratio)])
        .range([innerHeight, 0]);

    // color based on over/under
    const color = d => d.ratio > 1 ? "#e45756" : "#4caf50";

    // =========================
    // 5. AXES
    // =========================
    chart.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale));

    chart.append("g")
        .call(d3.axisLeft(yScale));

    // =========================
    // 6. REFERENCE LINE (y = 1)
    // =========================
    chart.append("line")
        .attr("x1", 0)
        .attr("x2", innerWidth)
        .attr("y1", yScale(1))
        .attr("y2", yScale(1))
        .attr("stroke", "black")
        .attr("stroke-dasharray", "4");

    chart.append("text")
        .attr("x", innerWidth - 50)
        .attr("y", yScale(1) - 5)
        .text("Expected (1)")
        .style("font-size", "12px");

    // =========================
    // 7. TOOLTIP
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
    // 8. DRAW BARS
    // =========================
    chart.selectAll("rect")
        .data(formatted)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.age))
        .attr("y", d => yScale(d.ratio))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d.ratio))
        .attr("fill", d => color(d))
        .on("mouseover", function (event, d) {
            tooltip
                .style("opacity", 1)
                .html(`
                    <strong>${d.age}</strong><br>
                    Ratio: ${d.ratio.toFixed(2)}<br>
                    ${d.ratio > 1 ? "Overrepresented" : "Underrepresented"}
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
    // 9. TITLE
    // =========================
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text("Representation Ratio by Age Group");
}