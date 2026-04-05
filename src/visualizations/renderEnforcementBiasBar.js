import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

/**
 * Enforcement Bias Chart: Detection Method Distribution by Age Group (100% Stacked)
 * Shows whether younger age groups are disproportionately caught by police vs cameras
 */
export function renderEnforcementBiasBar(container, data, options = {}) {
    const year = options.year || 2024;
    const actionType = options.actionType || "fines";
    const selectedAgeGroups = options.ageGroups; // optional array of age groups

    const actionFieldMap = {
        fines: "FINES",
        arrests: "ARRESTS",
        charges: "CHARGES"
    };

    const actionLabelMap = {
        fines: "Fines",
        arrests: "Arrests",
        charges: "Charges"
    };

    const actionField = actionFieldMap[actionType] || actionFieldMap.fines;
    const actionLabel = actionLabelMap[actionType] || actionLabelMap.fines;

    // =========================
    // CLEAR
    // =========================
    d3.select(container).selectAll("*").remove();

    const margin = { top: 40, right: 80, bottom: 50, left: 60 };
    const width = 650 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // =========================
    // FILTER DATA
    // =========================
    let filtered = data.filter(d => d.YEAR === year);
    if (selectedAgeGroups && selectedAgeGroups.length > 0) {
        filtered = filtered.filter(d => selectedAgeGroups.includes(d.AGE_GROUP));
    }

    // Normalize detection method names
    filtered.forEach(d => {
        if (d.DETECTION_METHOD === "Police issued") d.DETECTION_METHOD = "Police Patrols";
    });

    const detectionMethods = ["Camera", "Police Patrols"];
    const ageOrder = ["0-16", "17-25", "26-39", "40-64", "65 and over"];

    // Prepare data: sum selected enforcement action by age group and detection method
    const stackData = Array.from(
        d3.rollup(
            filtered,
            v => d3.sum(v, d => d[actionField]),
            d => d.AGE_GROUP,
            d => d.DETECTION_METHOD
        ),
        ([ageGroup, methodMap]) => {
            const obj = { ageGroup };
            detectionMethods.forEach(method => {
                obj[method] = methodMap.get(method) || 0;
            });
            return obj;
        }
    ).sort((a, b) => ageOrder.indexOf(a.ageGroup) - ageOrder.indexOf(b.ageGroup));

    // =========================
    // STACK (100% normalization)
    // =========================
    const stack = d3.stack()
        .keys(detectionMethods);

    const series = stack(stackData);

    // Normalize each bar to 100%
    series.forEach(s => {
        s.forEach(d => {
            const total = d.data["Camera"] + d.data["Police Patrols"] || 1;
            d[0] = (d[0] / total) * 100;
            d[1] = (d[1] / total) * 100;
        });
    });

    // =========================
    // SCALES
    // =========================
    const x = d3.scaleBand()
        .domain(stackData.map(d => d.ageGroup))
        .range([0, width])
        .padding(0.3);

    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    const root = getComputedStyle(document.documentElement);

    const color = d3.scaleOrdinal()
        .domain(detectionMethods)
        .range([
            root.getPropertyValue('--accent').trim(),  // Camera (blue)
            root.getPropertyValue('--sub').trim()       // Police Patrols (muted)
        ]);

    // =========================
    // AXES
    // =========================
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y).tickFormat(d => d + "%"));

    // =========================
    // TOOLTIP
    // =========================
    d3.select("#enforcement-bias-tooltip").remove();
    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "enforcement-bias-tooltip")
        .style("position", "absolute")
        .style("background", "var(--panel)")
        .style("padding", "6px")
        .style("border", "1px solid var(--border)")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("color", "var(--text)")
        .style("opacity", 0);

    // =========================
    // BARS (100% STACKED)
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
        .attr("x", d => x(d.data.ageGroup))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        .on("mouseover", (event, d) => {
            const key = event.currentTarget.parentNode.__data__.key;
            const percentage = (d[1] - d[0]).toFixed(1);
            tooltip.style("opacity", 1)
                .html(`<strong>${d.data.ageGroup}</strong><br>${key} ${actionLabel}: ${percentage}%`);
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
        .text(`Detection Method Distribution by Age Group (${actionLabel}, ${year})`);

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
        .text("Proportion (%)");

    // =========================
    // LEGEND
    // =========================
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 20}, 0)`);
    detectionMethods.forEach((method, i) => {
        const g = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);
        g.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", color(method));
        g.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .style("font-size", "12px")
            .style("fill", "var(--text)")
            .text(method);
    });
}