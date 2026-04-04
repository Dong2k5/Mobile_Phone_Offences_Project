// src/pages/categoryPage.js

import {
  loadAllData,
  getYears,
  getAgeGroups,
  filterByYear
} from "../data.js";

// AGE charts
import { renderHeatmap } from "../visualizations/heatmap.js";

// POPULATION charts
import { renderMap } from "../visualizations/mapChart.js";

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
      <div id="heatmap"></div>
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

    renderHeatmap("#heatmap", filtered, { year: selectedYear });
  }

  updateCharts();
}

// =====================
// POPULATION SECTION
// =====================

function renderPopulationSection(container, data, geoData) {

  let selectedYear = Math.max(...data.map(d => d.YEAR));

  container.innerHTML = `
    <h2>Population Analysis</h2>

    <div id="scatter"></div>
    <div id="stacked"></div>
    <div id="rank"></div>
    <div id="map"></div>
  `;

  // =====================
  // INITIAL RENDER
  // =====================
  renderMap("#map", data, geoData, { year: selectedYear });
}

// =====================
// HELPER
// =====================

function clearCharts(container) {
  container.querySelectorAll(".charts > div")
    .forEach(div => div.innerHTML = "");
}