import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function renderAgeFinesBar(container, data, options = {}) {
    const year = options.year || 2024;

    // =========================
    // CLEAR
    // =========================
    d3.select(container).selectAll("*").remove();

    const margin = { top: 40, right: 20, bottom: 50, left: 60 };
    const width = 500 - margin.left - margin.right;
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

    // Aggregate FINES_PER_100K by age group
    const finesByAge = d3.rollups(
        filtered,
        v => d3.sum(v, d => d.FINES_PER_100K),
        d => d.AGE_GROUP
    ).sort((a, b) => {
        // Sort by age order
        const ageOrder = ["0-16", "17-25", "26-39", "40-64", "65 and over"];
        return ageOrder.indexOf(a[0]) - ageOrder.indexOf(b[0]);
    });

    // =========================
    // SCALES
    // =========================
    const x = d3.scaleBand()
        .domain(finesByAge.map(d => d[0]))
        .range([0, width])
        .padding(0.3);

    const y = d3.scaleLinear()
        .domain([0, d3.max(finesByAge, d => d[1]) * 1.1])
        .range([height, 0]);

    // =========================
    // AXES
    // =========================
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    // =========================
    // TOOLTIP
    // =========================
    d3.select("#age-fines-tooltip").remove();

    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "age-fines-tooltip")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("padding", "6px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("opacity", 0);

    // =========================
    // BARS
    // =========================
    svg.selectAll(".bar")
        .data(finesByAge)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d[0]))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d[1]))
        .attr("height", d => height - y(d[1]))
        .attr("fill", "#60a5fa")
        .on("mouseover", (event, d) => {
            tooltip.style("opacity", 1)
                .html(`<strong>${d[0]}</strong><br>Fines per 100k: ${d[1].toFixed(1)}`);
        })
        .on("mousemove", event => {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", () => tooltip.style("opacity", 0));

    // =========================
    // TITLE
    // =========================
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("fill", "var(--text)")
        .text(`Mobile Phone Fines per 100k Residents by Age Group (${year})`);

    // =========================
    // LABELS
    // =========================
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "var(--text)")
        .text("Age Group");

    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "var(--text)")
        .text("Fines per 100k Residents");
}