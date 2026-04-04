import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { drawScatterPlot } from "./scatterPlot.js";
import { drawStackedBar } from "./stackedBar.js";
import { drawRankChange } from "./rankChange.js";
import { drawMap } from "./map.js";

Promise.all([
    d3.csv("data/mobile_phone_enforcement_merged.csv", d => ({
        YEAR: +d.YEAR,
        JURISDICTION: d.JURISDICTION,
        FINES: +d.FINES,
        ARRESTS: +d.ARRESTS,
        CHARGES: +d.CHARGES,
        POPULATION: +d.POPULATION
    })),
    d3.json("data/australia-states.geojson")
]).then(([data, geoData]) => {

    const states = [...new Set(data.map(d => d.JURISDICTION))];

    // =========================
    // SCATTER FILTER
    // =========================
    const scatterSelect = d3.select("#scatterFilter");

    states.forEach(state => {
        scatterSelect.append("option")
            .attr("value", state)
            .text(state);
    });

    scatterSelect.on("change", function () {
        const selected = this.value;

        if (selected === "All") {
            drawScatterPlot(data);
        } else {
            drawScatterPlot(data.filter(d => d.JURISDICTION === selected));
        }
    });

    // =========================
    // STACKED CHECKBOX FILTER
    // =========================
    let selectedTypes = ["fines", "arrests", "charges"];

    d3.selectAll("input[type=checkbox]").on("change", function () {

        selectedTypes = [];

        d3.selectAll("input[type=checkbox]:checked").each(function () {
            selectedTypes.push(this.value);
        });

        drawStackedBar(data, selectedTypes);
    });

    // =========================
    // INITIAL DRAW
    // =========================
    drawScatterPlot(data);
    drawStackedBar(data);
    drawRankChange(data);
    drawMap(data, geoData);

}).catch(error => {
    console.error("Error loading data:", error);
});