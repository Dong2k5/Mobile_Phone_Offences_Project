import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

/**
 * Heatmap: Age Group vs Location (Urban-Regional-Remote)
 */
export function renderHeatmap(container, data, options = {}) {

    const year = options.year || 2024;

    // =========================
    // CLEAR CONTAINER
    // =========================
    d3.select(container).selectAll("*").remove();

    const margin = { top: 50, right: 20, bottom: 50, left: 80 };
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // =========================
    // FILTER YEAR
    // =========================
    const filtered = data.filter(d => d.YEAR === year);

    // =========================
    // AGGREGATE DATA
    // =========================
    const heatData = d3.rollups(
        filtered,
        v => d3.sum(v, d => d.FINES + d.ARRESTS + d.CHARGES),
        d => d.AGE_GROUP,
        d => {
            if (d.LOCATION === "Others") return "Remote";
            return d.LOCATION;
        }
    );

    const flatData = [];
    heatData.forEach(([age, locations]) => {
        locations.forEach(([loc, value]) => {
            flatData.push({
                age,
                location: loc,
                value
            });
        });
    });

    const ageGroups = [...new Set(flatData.map(d => d.age))];
    const locations = [...new Set(flatData.map(d => d.location))];

    const x = d3.scaleBand()
        .domain(ageGroups)
        .range([0, width])
        .padding(0.05);

    const y = d3.scaleBand()
        .domain(locations)
        .range([0, height])
        .padding(0.05);

    const color = d3.scaleSequential(d3.interpolateReds)
        .domain([0, d3.max(flatData, d => d.value)]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    d3.select("#heatmap-tooltip").remove();
    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "heatmap-tooltip")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("padding", "6px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("opacity", 0);

    svg.selectAll()
        .data(flatData)
        .enter()
        .append("rect")
        .attr("x", d => x(d.age))
        .attr("y", d => y(d.location))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .attr("fill", d => color(d.value))
        .on("mouseover", (event, d) => {
            tooltip
                .style("opacity", 1)
                .html(`
                    <strong>${d.age} - ${d.location}</strong><br>
                    Offences: ${d.value.toLocaleString()}
                `);
        })
        .on("mousemove", event => {
            tooltip
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", () => {
            tooltip.style("opacity", 0);
        });

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(`Age Group vs Location Offences (${year})`);
}