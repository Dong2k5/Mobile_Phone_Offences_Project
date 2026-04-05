import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

/**
 * Pie Chart: Detection Methods (Camera vs Police issued)
 */
export function renderPieChart(container, data, options = {}) {
    const year = options.year || 2024;

    // =========================
    // CLEAR
    // =========================
    d3.select(container).selectAll("*").remove();

    // =========================
    // SETUP
    // =========================
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 50;

    const wrapper = d3.select(container)
        .append("div")
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("align-items", "center")
        .style("gap", "30px");

    const svg = wrapper
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // =========================
    // FILTER YEAR
    // =========================
    const filtered = data.filter(d => d.YEAR === year);

    // =========================
    // AGGREGATE DETECTION METHODS
    // =========================
    const counts = { "Camera": 0, "Police Patrols": 0 };

    filtered.forEach(d => {
        const method = d.DETECTION_METHOD;
        if (method === "Camera") counts["Camera"] += 1;
        else if (method === "Police issued") counts["Police Patrols"] += 1;
        // Ignore Others
    });

    const pieData = Object.entries(counts).map(([label, value]) => ({ label, value }));

    // =========================
    // COLOR
    // =========================
    const root = getComputedStyle(document.documentElement);

    const color = d3.scaleOrdinal()
        .domain(pieData.map(d => d.label))
        .range([
            root.getPropertyValue('--accent').trim(), // Camera
            root.getPropertyValue('--sub').trim()   // Police
        ]);

    // =========================
    // PIE + ARC
    // =========================
    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const arcs = svg.selectAll("arc")
        .data(pie(pieData))
        .enter();

    // =========================
    // TOOLTIP
    // =========================
    d3.select("#pie-tooltip").remove();
    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "pie-tooltip")
        .style("position", "absolute")
        .style("background", "var(--panel)")
        .style("padding", "6px")
        .style("border", "1px solid var(--border)")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("color", "var(--text)")
        .style("opacity", 0);

    // =========================
    // DRAW SLICES
    // =========================
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.label))
        .attr("stroke", "#fff")
        .style("stroke-width", "2px")
        .on("mouseover", function (event, d) {
            d3.select(this).attr("opacity", 0.7);

            const total = d3.sum(pieData, d => d.value);
            const percent = ((d.data.value / total) * 100).toFixed(1);

            tooltip
                .style("opacity", 1)
                .html(`
                    <strong>${d.data.label}</strong><br>
                    Count: ${d.data.value} out of ${total}<br>
                    Share: ${percent}%
                `);
        })
        .on("mousemove", function (event) {
            tooltip
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function () {
            d3.select(this).attr("opacity", 1);
            tooltip.style("opacity", 0);
        });

    // =========================
    // LABELS
    // =========================
    const labelArc = d3.arc()
        .innerRadius(radius * 0.45)
        .outerRadius(radius * 0.65);

    arcs.append("text")
        .attr("transform", d => `translate(${labelArc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("fill", "var(--text)")
        .text(d => {
            const total = d3.sum(pieData, d => d.value);
            const percent = (d.data.value / total) * 100;
            return percent > 5 ? `${percent.toFixed(1)}%` : "";
        });

    // =========================
    // TITLE
    // =========================
    svg.append("text")
        .attr("y", -height / 2 + 30)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("fill", "var(--text)")
        .text(`Detection Methods (${year})`);

    // =========================
    // LEGEND
    // =========================
    const legend = wrapper
        .append("div")
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("gap", "10px");

    pieData.forEach(d => {
        const item = legend.append("div")
            .style("display", "flex")
            .style("align-items", "center")
            .style("gap", "8px");

        item.append("div")
            .style("width", "14px")
            .style("height", "14px")
            .style("border-radius", "3px")
            .style("background", color(d.label));

        item.append("span")
            .style("font-size", "13px")
            .style("fill", "var(--text)")
            .text(d.label);
    });
}