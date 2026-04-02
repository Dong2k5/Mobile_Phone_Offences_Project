import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { drawAgeStackedBar } from "./ageStackedBar.js";
import { drawAgePie } from "./agePieChart.js";

d3.csv("data/mobile_phone_enforcement_age_all_states.csv", d => ({
    YEAR: +d.YEAR,
    AGE_GROUP: d.AGE_GROUP,
    FINES: +d.FINES,
    ARRESTS: +d.ARRESTS,
    CHARGES: +d.CHARGES
}))
    .then(data => {

        console.log("Age Data Loaded:", data);

        // =========================
        // SETUP VARIABLES
        // =========================
        let selectedTypes = ["fines", "arrests", "charges"];

        const years = [...new Set(data.map(d => d.YEAR))];
        const ageGroups = [...new Set(data.map(d => d.AGE_GROUP))];

        const yearSelect = d3.select("#ageYearFilter");
        const pieSelect = d3.select("#agePieFilter");

        // =========================
        // POPULATE YEAR DROPDOWN
        // =========================
        years.forEach(year => {
            yearSelect.append("option")
                .attr("value", year)
                .text(year);
        });

        // =========================
        // POPULATE AGE DROPDOWN
        // =========================
        ageGroups.forEach(age => {
            pieSelect.append("option")
                .attr("value", age)
                .text(age);
        });

        // =========================
        // YEAR FILTER
        // =========================
        yearSelect.on("change", updateCharts);

        // =========================
        // AGE GROUP FILTER (PIE)
        // =========================
        pieSelect.on("change", updateCharts);

        // =========================
        // CHECKBOX FILTER
        // =========================
        d3.selectAll("#age-checkboxes input[type=checkbox]")
            .on("change", function () {

                selectedTypes = [];

                d3.selectAll("#age-checkboxes input[type=checkbox]:checked")
                    .each(function () {
                        selectedTypes.push(this.value);
                    });

                updateCharts();
            });

        // =========================
        // UPDATE FUNCTION (KEY IDEA 🔥)
        // =========================
        function updateCharts() {
            const selectedYear = +yearSelect.property("value");
            const selectedAge = pieSelect.property("value");

            const filtered = data.filter(d => d.YEAR === selectedYear);

            drawAgeStackedBar(filtered, selectedTypes);
            drawAgePie(filtered, selectedAge, selectedTypes);
        }

        // =========================
        // INITIAL DRAW
        // =========================
        const latestYear = d3.max(data, d => d.YEAR);

        yearSelect.property("value", latestYear);
        pieSelect.property("value", ageGroups[0]);

        updateCharts();

    })
    .catch(error => {
        console.error("Error loading age dataset:", error);
    });