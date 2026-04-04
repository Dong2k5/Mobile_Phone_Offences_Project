import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { width, height } from "../sharedConstants.js";

// ✅ THIS is what loadData.js imports
export function drawMap(data, geoData) {

    d3.select("#map-container").selectAll("*").remove();

    const svg = d3.select("#map-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // =========================
    // FILTER YEAR
    // =========================
    const filtered = data.filter(d => d.YEAR === 2024);

    // =========================
    // CALCULATE RATE
    // =========================
    const stateData = d3.rollups(
        filtered,
        v => {
            return d3.mean(v, d =>
                (d.FINES + d.ARRESTS + d.CHARGES) / d.POPULATION * 100000
            );
        },
        d => d.JURISDICTION
    );

    const rateMap = new Map(stateData);

    // =========================
    // PROJECTION
    // =========================
    const projection = d3.geoMercator()
        .fitSize([width, height], geoData);

    const path = d3.geoPath().projection(projection);

    const actCoords = projection([149.13, -35.28]); // Canberra

    svg.append("circle")
        .attr("cx", actCoords[0])
        .attr("cy", actCoords[1])
        .attr("r", 5)
        .attr("fill", "red")
        .attr("stroke", "#000")
        .on("mouseover", function () {
            const rate = rateMap.get("ACT");

            tooltip
                .style("opacity", 1)
                .html(`
                <strong>ACT</strong><br>
                Rate: ${rate ? rate.toFixed(1) : "N/A"} per 100k
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
    // COLOR SCALE
    // =========================
    const color = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, d3.max(stateData, d => d[1])]);

    // =========================
    // NAME MAP
    // =========================
    const nameMap = {
        "NSW": "New South Wales",
        "VIC": "Victoria",
        "QLD": "Queensland",
        "WA": "Western Australia",
        "SA": "South Australia",
        "TAS": "Tasmania",
        "NT": "Northern Territory",
        "ACT": "Australian Capital Territory"
    };

    // =========================
    // TOOLTIP
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
    // DRAW MAP
    // =========================
    svg.selectAll("path")
        .data(geoData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", d => {

            const stateName = d.properties.STATE_NAME;

            const entry = Object.entries(nameMap)
                .find(([key, value]) => value === stateName);

            if (!entry) return "#ccc";

            const code = entry[0];
            const rate = rateMap.get(code);

            return rate ? color(rate) : "#ccc";
        })
        .attr("stroke", "#333")
        .on("mouseover", function (event, d) {

            const stateName = d.properties.STATE_NAME;

            const entry = Object.entries(nameMap)
                .find(([key, value]) => value === stateName);

            if (!entry) return;

            const code = entry[0];
            const rate = rateMap.get(code);

            tooltip
                .style("opacity", 1)
                .html(`
                    <strong>${stateName}</strong><br>
                    Rate: ${rate ? rate.toFixed(1) : "N/A"} per 100k
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
    // TITLE
    // =========================
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text("Offence Rate per 100k by Jurisdiction (2024)");
}