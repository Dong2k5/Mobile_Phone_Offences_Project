import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { width, height, margin, innerWidth, innerHeight } from "../sharedConstants.js";

export function drawAgeStackedBar(data, selectedTypes = ["fines", "arrests", "charges"]) {

    d3.select("#age-stacked-container").selectAll("*").remove();

    const svg = d3.select("#age-stacked-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const keys = selectedTypes;

    // =========================
    // 1. AGGREGATE DATA
    // =========================
    const grouped = d3.rollups(
        data,
        v => {
            const values = {
                fines: d3.sum(v, d => d.FINES),
                arrests: d3.sum(v, d => d.ARRESTS),
                charges: d3.sum(v, d => d.CHARGES)
            };

            const total = keys.reduce((sum, key) => sum + (values[key] || 0), 0);

            if (total === 0) {
                return { fines: 0, arrests: 0, charges: 0 };
            }

            return {
                fines: values.fines / total || 0,
                arrests: values.arrests / total || 0,
                charges: values.charges / total || 0
            };
        },
        d => d.AGE_GROUP
    );

    const formatted = grouped.map(([age, val]) => ({
        age,
        ...val
    }));

    // =========================
    // 2. STACK
    // =========================
    const stack = d3.stack().keys(keys);
    const stackedData = stack(formatted);

    // =========================
    // 3. SCALES
    // =========================
    const xScale = d3.scaleBand()
        .domain(formatted.map(d => d.age))
        .range([0, innerWidth])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([innerHeight, 0]);

    const color = d3.scaleOrdinal()
        .domain(["fines", "arrests", "charges"])
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
    chart.selectAll("g.layer")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d.map(v => ({
            key: d.key,
            value: v,
            age: v.data.age
        })))
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.age))
        .attr("y", d => yScale(d.value[1]))
        .attr("height", d => yScale(d.value[0]) - yScale(d.value[1]))
        .attr("width", xScale.bandwidth())
        .on("mouseover", function (event, d) {
            const percent = ((d.value.data[d.key] || 0) * 100).toFixed(1);

            tooltip
                .style("opacity", 1)
                .html(`
                    <strong>Age: ${d.age}</strong><br>
                    Type: ${d.key}<br>
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
    // 7. LEGEND
    // =========================
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 250}, 40)`);

    keys.forEach((key, i) => {
        const g = legend.append("g")
            .attr("transform", `translate(${i * 90}, 0)`);

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
    // 8. LABELS
    // =========================
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .text("Age Group");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .text("Proportion");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text("Enforcement Type by Age Group");
}