import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function renderEnforcementBiasBar(container, data, options = {}) {
    const year = options.year || 2024;

    // =========================
    // CLEAR
    // =========================
    d3.select(container).selectAll("*").remove();

    const margin = { top: 40, right: 20, bottom: 50, left: 80 };
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

    // Convert "Others" → "Remote"
    filtered.forEach(d => {
        if (d.LOCATION === "Others") d.LOCATION = "Remote";
    });

    const locations = ["Urban", "Regional", "Remote"];

    // Prepare stacked data by jurisdiction
    const stackData = Array.from(
        d3.rollup(
            filtered,
            v => d3.sum(v, d => d.FINES + d.ARRESTS + d.CHARGES),
            d => d.JURISDICTION,
            d => d.LOCATION
        ),
        ([jurisdiction, locationMap]) => {
            const obj = { jurisdiction };
            locations.forEach(loc => {
                obj[loc] = locationMap.get(loc) || 0; // fill missing with 0
            });
            return obj;
        }
    );

    // =========================
    // STACK
    // =========================
    const stack = d3.stack()
        .keys(locations);

    const series = stack(stackData);

    // =========================
    // SCALES
    // =========================
    const x = d3.scaleBand()
        .domain(stackData.map(d => d.jurisdiction))
        .range([0, width])
        .padding(0.3);

    const y = d3.scaleLinear()
        .domain([0, d3.max(stackData, d => locations.reduce((sum, key) => sum + d[key], 0)) * 1.1])
        .range([height, 0]);

    const root = getComputedStyle(document.documentElement);

    const color = d3.scaleOrdinal()
        .domain(locations)
        .range([
            root.getPropertyValue('--accent').trim(),  // Urban
            root.getPropertyValue('--text').trim(),   // Regional
            root.getPropertyValue('--sub').trim()      // Remote
        ]);

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
    d3.select("#enforcement-bias-tooltip").remove();
    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "enforcement-bias-tooltip")
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
            const key = event.currentTarget.parentNode.__data__.key;
            tooltip.style("opacity", 1)
                .html(`<strong>${d.data.jurisdiction}</strong><br>${key}: ${d.data[key]}`);
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
        .text(`Enforcement Bias: Urban vs Regional vs Remote (${year})`);

    // =========================
    // LABELS
    // =========================
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "var(--text)")
        .text("Jurisdiction");

    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", -65)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "var(--text)")
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
            .style("fill", "var(--text)")
            .text(loc);
    });
}