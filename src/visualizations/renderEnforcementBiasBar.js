import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function renderEnforcementBiasBar(container, data, options = {}) {
    const year = options.year || 2024;

    // =========================
    // CLEAR
    // =========================
    d3.select(container).selectAll("*").remove();

    const margin = { top: 40, right: 20, bottom: 60, left: 60 };
    const width = 600 - margin.left - margin.right;
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

    // Map "Others" → "Remote" like in other charts
    filtered.forEach(d => {
        if (d.LOCATION === "Others") d.LOCATION = "Remote";
    });

    // Aggregate by JURISDICTION and DETECTION_METHOD
    const stackData = Array.from(
        d3.rollup(
            filtered,
            v => d3.sum(v, d => d.FINES + d.ARRESTS + d.CHARGES),
            d => d.JURISDICTION,
            d => d.LOCATION // Urban / Regional / Remote
        ),
        ([jurisdiction, locationMap]) => {
            const obj = { jurisdiction };
            for (let [loc, total] of locationMap) {
                obj[loc] = total;
            }
            return obj;
        }
    );

    const locations = ["Urban", "Regional", "Remote"];

    const stack = d3.stack()
        .keys(locations)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    const series = stack(stackData);

    // =========================
    // SCALES
    // =========================
    const x = d3.scaleBand()
        .domain(stackData.map(d => d.jurisdiction))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(stackData, d =>
            locations.reduce((sum, loc) => sum + (d[loc] || 0), 0)
        ) * 1.1])
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .domain(locations)
        .range(["#60a5fa", "#facc15", "#34d399"]);

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
    d3.select("#enforcement-tooltip").remove();

    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "enforcement-tooltip")
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
    svg.selectAll("g.layer")
        .data(series)
        .enter()
        .append("g")
        .attr("class", "layer")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("x", d => x(d.data.jurisdiction))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        .on("mouseover", (event, d) => {
            const loc = locations.find(loc => d.data[loc] === (d[1] - d[0]));
            tooltip.style("opacity", 1)
                .html(`<strong>${d.data.jurisdiction}</strong><br>${loc}: ${(d[1] - d[0]).toLocaleString()} offences`);
        })
        .on("mousemove", event => {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", () => tooltip.style("opacity", 0));

    // =========================
    // TITLE & LABELS
    // =========================
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(`Enforcement Bias by Location (${year})`);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Jurisdiction");

    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", -45)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Total Offences");

    // =========================
    // LEGEND
    // =========================
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 100}, 0)`);

    locations.forEach((loc, i) => {
        const g = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);

        g.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", color(loc));

        g.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .style("font-size", "12px")
            .text(loc);
    });
}