import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { drawScatterPlot } from "./scatterPlot.js";
import { drawStackedBar } from "./stackedBar.js";

d3.csv("data/mobile_phone_enforcement_merged.csv", d => ({
    YEAR: +d.YEAR,
    JURISDICTION: d.JURISDICTION,
    FINES: +d.FINES,
    ARRESTS: +d.ARRESTS,
    CHARGES: +d.CHARGES,
    POPULATION: +d.POPULATION
}))
    .then(data => {

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
        // STACKED FILTER
        // =========================
        const stackedSelect = d3.select("#stackedFilter");

        states.forEach(state => {
            stackedSelect.append("option")
                .attr("value", state)
                .text(state);
        });

        let selectedTypes = ["fines", "arrests", "charges"];

        // listen to checkbox changes
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

    })
    .catch(error => {
        console.error("Error loading the dataset:", error);
    });