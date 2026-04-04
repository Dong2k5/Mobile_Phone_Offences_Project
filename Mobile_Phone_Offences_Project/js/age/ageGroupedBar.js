import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { width, height, margin, innerWidth, innerHeight } from "../sharedConstants.js";

export function drawAgeGroupedBar(data) {

    d3.select("#age-grouped-container").selectAll("*").remove();

    const svg = d3.select("#age-grouped-container")
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
    // 2. CONVERT TO %
    // =========================
    const totalOffences = d3.sum(formatted, d => d.offences);
    const totalPopulation = d3.sum(formatted, d => d.population);

    formatted = formatted.map(d => ({
        age: d.age,
        offencePct: d.offences / totalOffences,
        populationPct: d.population / totalPopulation
    }));

    // =========================
    // 3. SCALES
    // =========================
    const x0 = d3.scaleBand()
        .domain(formatted.map(d => d.age))
        .range([0, innerWidth])
        .padding(0.2);

    const x1 = d3.scaleBand()
        .domain(["Offences", "Population"])
        .range([0, x0.bandwidth()])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(formatted, d => Math.max(d.offencePct, d.populationPct))])
        .range([innerHeight, 0]);

    const color = d3.scaleOrdinal()
        .domain(["Offences", "Population"])
        .range(["#e45756", "#4caf50"]);

    // =========================
    // 4. AXES
    // =========================
    chart.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(x0));

    chart.append("g")
        .call(d3.axisLeft(yScale).tickFormat(d3.format(".0%")));

    // =========================
    // 5. TOOLTIP
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
    // 6. DRAW BARS
    // =========================
    chart.selectAll("g.age")
        .data(formatted)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${x0(d.age)}, 0)`)
        .selectAll("rect")
        .data(d => [
            { key: "Offences", value: d.offencePct, age: d.age },
            { key: "Population", value: d.populationPct, age: d.age }
        ])
        .enter()
        .append("rect")
        .attr("x", d => x1(d.key))
        .attr("y", d => yScale(d.value))
        .attr("width", x1.bandwidth())
        .attr("height", d => innerHeight - yScale(d.value))
        .attr("fill", d => color(d.key))
        .on("mouseover", function (event, d) {
            tooltip
                .style("opacity", 1)
                .html(`
                    <strong>${d.age}</strong><br>
                    ${d.key}: ${(d.value * 100).toFixed(1)}%
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
    // 7. LEGEND
    // =========================
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 220}, 40)`);

    ["Offences", "Population"].forEach((key, i) => {
        const g = legend.append("g")
            .attr("transform", `translate(${i * 110}, 0)`);

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
    // 8. TITLE
    // =========================
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text("Offence vs Population Distribution by Age Group");
}