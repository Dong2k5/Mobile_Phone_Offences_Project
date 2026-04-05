import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function renderStackedBarChart(container, data, options = {}) {

    const year = options.year || 2024;

    d3.select(container).selectAll("*").remove();

    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 20, bottom: 60, left: 60 };

    const svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // =====================
    // FILTER & AGGREGATE
    // =====================
    const filtered = data.filter(d => d.YEAR === year);

    // Replace "Others" with "Remote"
    filtered.forEach(d => {
        if (d.LOCATION === "Others") d.LOCATION = "Remote";
    });

    // Get all location types dynamically
    const subgroups = Array.from(new Set(filtered.map(d => d.LOCATION)));

    // Group by jurisdiction & location
    const locationMap = d3.rollups(
        filtered,
        v => ({ total: d3.sum(v, d => d.FINES + d.ARRESTS + d.CHARGES) }),
        d => d.JURISDICTION,
        d => d.LOCATION
    );
    // Transform for stacked chart
    const stackData = locationMap.map(([jurisdiction, locArr]) => {
        const obj = { jurisdiction };
        subgroups.forEach(loc => {
            const entry = locArr.find(([l]) => l === loc);
            obj[loc] = entry ? entry[1].total : 0;
        });
        return obj;
    });

    const groups = stackData.map(d => d.jurisdiction);

    // =====================
    // SCALES
    // =====================
    const x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(stackData, d => d3.sum(subgroups, k => d[k]))])
        .nice()
        .range([height, 0]);

    const root = getComputedStyle(document.documentElement);

    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range([
            root.getPropertyValue('--accent').trim(),
            root.getPropertyValue('--text').trim(),
            root.getPropertyValue('--sub').trim()
        ]);

    const stackedData = d3.stack()
        .keys(subgroups)
        (stackData);

    // =====================
    // AXES
    // =====================
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    // =====================
    // DRAW BARS
    // =====================
    svg.selectAll("g.layer")
        .data(stackedData)
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
        .on("mouseover", function (event, d) {
            const subgroupName = this.parentNode.__data__.key;
            const value = d.data[subgroupName];
            d3.select(this).attr("opacity", 0.7);

            d3.select("#stack-tooltip").style("opacity", 1)
                .html(`
          <strong>${d.data.jurisdiction}</strong><br>
          ${subgroupName}: ${value.toLocaleString()}
          <br> ${((value / d3.sum(subgroups, k => d.data[k])) * 100).toFixed(1)}%
        `)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mousemove", function (event) {
            d3.select("#stack-tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function () {
            d3.select(this).attr("opacity", 1);
            d3.select("#stack-tooltip").style("opacity", 0);
        });

    // =====================
    // TOOLTIP
    // =====================
    d3.select("#stack-tooltip").remove();
    d3.select("body")
        .append("div")
        .attr("id", "stack-tooltip")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("padding", "6px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("opacity", 0);

    // =====================
    // TITLE
    // =====================
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("fill", "var(--text)")
        .text(`Urban vs Regional vs Remote Distractions (${year})`);

    // =====================
    // LEGEND
    // =====================
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 120},0)`);

    subgroups.forEach((key, i) => {
        const g = legend.append("g").attr("transform", `translate(0,${i * 20})`);
        g.append("rect")
            .attr("width", 14)
            .attr("height", 14)
            .attr("fill", color(key));
        g.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .style("font-size", "12px")
            .style("fill", "var(--text)")
            .text(key);
    });
}