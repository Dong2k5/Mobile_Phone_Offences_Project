// src/pages/categoryPage.js

import {
  loadAllData,
  getYears,
  getAgeGroups,
  filterByYear
} from "../data.js";

// AGE charts
import { renderHeatmap } from "../visualizations/heatmap.js";
import { renderLineChart } from "../visualizations/lineChart.js";
import { renderAgeFinesBar } from "../visualizations/renderAgeFinesBar.js";
import { renderEnforcementBiasBar } from "../visualizations/renderEnforcementBiasBar.js";

// POPULATION charts
import { renderMap } from "../visualizations/mapChart.js";
import { renderDualAxisBar } from "../visualizations/dualAxisBar.js";
import { renderPieChart } from "../visualizations/pieChart.js";
import { renderStackedBarChart } from "../visualizations/stackedBarChart.js";

export async function renderCategoryPage(initialCategory = "population") {

  const container = document.getElementById("content");

  const { ageData, mergedData, geoData } = await loadAllData();

  let currentCategory = initialCategory;

  function render() {

    container.innerHTML = `
      <div class="category-tabs">
        <button id="btnPopulation" class="${currentCategory === "population" ? "active" : ""}">
          🗺 Population
        </button>
        <button id="btnAge" class="${currentCategory === "age" ? "active" : ""}">
          📊 Age Groups
        </button>
      </div>

      <div id="categoryContent"></div>
    `;

    const content = container.querySelector("#categoryContent");

    if (currentCategory === "age") {
      renderAgeSection(content, ageData);
    } else {
      renderPopulationSection(content, mergedData, geoData);
    }

    // Toggle events
    container.querySelector("#btnPopulation").onclick = () => {
      currentCategory = "population";
      render();
    };

    container.querySelector("#btnAge").onclick = () => {
      currentCategory = "age";
      render();
    };
  }

  render();
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
      <p>The Urban-Regional Demographic Intersection</p>
      <div id="heatmap"></div>

      <p>Trend of Mobile Phone Offences over time</p>
      <div id="lineChart"></div>

      <p>Fines per 100k Residents by Age Group</p>
      <div id="ageFinesBar"></div>

      <p>Enforcement Bias: Urban vs Regional vs Remote</p>
      <div id="enforcementBiasBar"></div>
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
    renderLineChart("#lineChart", ageData);
    renderAgeFinesBar("#ageFinesBar", ageData, { year: selectedYear });
    renderEnforcementBiasBar("#enforcementBiasBar", ageData, { year: selectedYear });
  }

  updateCharts();
}

// =====================
// POPULATION SECTION
// =====================

function renderPopulationSection(container, data, geoData) {

  // FIRST, get the years
  const years = getYears(data); // use population dataset, not ageData
  let selectedYear = Math.max(...years);

  container.innerHTML = `
    <h2>Population Analysis</h2>

    <select id="yearFilter"></select>

    <div class="charts">
      <p>Total Fines vs. Fines per 100k Residents by Jurisdiction</p>
      <div id="dualAxis"></div>

      <p>The Spatial Heat of Distraction</p>
      <div id="map"></div>

      <p>Detection Methods: Automated Cameras vs. Police Patrols</p>
      <div id="pie"></div>

      <p>Urban vs Regional: Where are Drivers Most Distracted?</p>
      <div id="stackedBar"></div>
    </div>
  `;

  const yearSelect = container.querySelector("#yearFilter");

  years.forEach(y => {
    const option = new Option(y, y);
    yearSelect.add(option);
  });

  yearSelect.value = selectedYear;

  yearSelect.onchange = () => {
    selectedYear = +yearSelect.value;
    updateCharts();
  };

  function updateCharts() {
    clearCharts(container);

    renderMap("#map", data, geoData, { year: selectedYear });
    renderDualAxisBar("#dualAxis", data, { year: selectedYear });
    renderPieChart("#pie", data, { year: selectedYear });
    renderStackedBarChart("#stackedBar", data, { year: selectedYear });
  }

  updateCharts();
}

// =====================
// HELPER
// =====================

function clearCharts(container) {
  container.querySelectorAll(".charts > div")
    .forEach(div => div.innerHTML = "");
}