// src/pages/categoryPage.js

import {
  loadAllData,
  getYears,
  getAgeGroups,
  filterByYear
} from "../data.js";

// AGE charts
import { renderAgeStackedBar } from "../visualizations/ageStackedBar.js";
import { renderAgePie } from "../visualizations/agePieChart.js";
import { renderAgeGroupedBar } from "../visualizations/ageGroupedBar.js";
import { renderAgeRatioBar } from "../visualizations/ageRatioBar.js";

// POPULATION charts (you will adapt these)
import { renderMap } from "../visualizations/mapChart.js";
import { renderScatterPlot } from "../visualizations/scatterPlot.js";
import { renderStackedBar } from "../visualizations/stackedBar.js";
import { renderRankChange } from "../visualizations/rankChange.js";

export async function renderCategoryPage(category) {

  const container = document.getElementById("content");

  // =====================
  // LOAD DATA
  // =====================
  const { ageData, mergedData, geoData } = await loadAllData();

  // =====================
  // SWITCH CATEGORY
  // =====================
  if (category === "age") {
    renderAgeSection(container, ageData);
  } else {
    renderPopulationSection(container, mergedData, geoData);
  }
}

// =====================
// AGE SECTION
// =====================

function renderAgeSection(container, ageData) {

  const years = getYears(ageData);
  const ageGroups = getAgeGroups(ageData);

  let selectedYear = Math.max(...years);
  let selectedAge = ageGroups[0];
  let selectedTypes = ["FINES", "ARRESTS", "CHARGES"];

  container.innerHTML = `
    <h2>Age Group Analysis</h2>

    <div class="controls">
      <select id="yearFilter"></select>
      <select id="ageFilter"></select>

      <div id="typeCheckboxes">
        <label><input type="checkbox" value="FINES" checked> Fines</label>
        <label><input type="checkbox" value="ARRESTS" checked> Arrests</label>
        <label><input type="checkbox" value="CHARGES" checked> Charges</label>
      </div>
    </div>

    <div class="charts">
      <div id="stackedBar"></div>
      <div id="pieChart"></div>
      <div id="groupedBar"></div>
      <div id="ratioBar"></div>
    </div>
  `;

  const yearSelect = container.querySelector("#yearFilter");
  const ageSelect = container.querySelector("#ageFilter");

  years.forEach(y => {
    const option = new Option(y, y);
    yearSelect.add(option);
  });

  ageGroups.forEach(a => {
    const option = new Option(a, a);
    ageSelect.add(option);
  });

  yearSelect.value = selectedYear;
  ageSelect.value = selectedAge;

  yearSelect.onchange = () => {
    selectedYear = +yearSelect.value;
    updateCharts();
  };

  ageSelect.onchange = () => {
    selectedAge = ageSelect.value;
    updateCharts();
  };

  container.querySelectorAll("#typeCheckboxes input")
    .forEach(cb => {
      cb.onchange = () => {
        selectedTypes = Array.from(
          container.querySelectorAll("#typeCheckboxes input:checked")
        ).map(cb => cb.value);

        if (selectedTypes.length > 0) updateCharts();
      };
    });

  function updateCharts() {
    const filtered = filterByYear(ageData, selectedYear);

    clearCharts(container);

    renderAgeStackedBar("#stackedBar", filtered, selectedTypes);
    renderAgePie("#pieChart", filtered, selectedAge, selectedTypes);
    renderAgeGroupedBar("#groupedBar", filtered);
    renderAgeRatioBar("#ratioBar", filtered);
  }

  updateCharts();
}

// =====================
// POPULATION SECTION
// =====================

function renderPopulationSection(container, data, geoData) {

  container.innerHTML = `
    <h2>Population Analysis</h2>

    <label>Scatter Filter:</label>
    <select id="scatterFilter">
        <option value="All">All</option>
    </select>

    <div id="scatter"></div>

    <hr>

    <h3>Filter Enforcement Type</h3>
    <label><input type="checkbox" value="FINES" checked> Fines</label>
    <label><input type="checkbox" value="ARRESTS" checked> Arrests</label>
    <label><input type="checkbox" value="CHARGES" checked> Charges</label>

    <div id="stacked"></div>

    <hr>

    <h2>Rank Change</h2>
    <div id="rank"></div>

    <hr>

    <h2>Choropleth Map</h2>
    <div id="map"></div>
  `;

  // =====================
  // INITIAL RENDER
  // =====================

  renderScatterPlot("#scatter", data);
  renderStackedBar("#stacked", data);
  renderRankChange("#rank", data);
  renderMap("#map", data, geoData);
}

// =====================
// HELPER
// =====================

function clearCharts(container) {
  container.querySelectorAll(".charts > div")
    .forEach(div => div.innerHTML = "");
}