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

let currentState = {
  category: "population",
  year: 2024,
  actionType: "fines",
  selectedState: null,
};

export async function renderCategoryPage(initialCategory = "population") {
  currentState.category = initialCategory;

  const container = document.getElementById("content");
  const { ageData, mergedData, geoData } = await loadAllData();

  container.innerHTML = `
    <!-- Category Selection -->
    <section class="category-section">
      <div class="category-container">
        <h1>Select Analysis Category</h1>
        <div class="category-buttons">
          <button class="category-btn ${currentState.category === "age" ? "active" : ""}" id="btnAge">📊 Age Group Distribution</button>
          <button class="category-btn ${currentState.category === "population" ? "active" : ""}" id="btnPopulation">🗺 Population-Based Analysis</button>
        </div>
      </div>
    </section>

    <!-- Controls -->
    <section class="controls-section">
      <div class="controls-container">
        <div class="controls-grid">
          <div class="control-group">
            <label>Year</label>
            <input type="range" min="2008" max="2024" value="${currentState.year}" id="yearSlider" style="width: 100%;">
            <div style="margin-top: 8px; text-align: center; font-size: 12px; color: var(--light);">
              <strong id="year-display">${currentState.year}</strong>
            </div>
          </div>

          <div class="control-group">
            <label>Enforcement Type</label>
            <select id="actionTypeSelect">
              <option value="fines" ${currentState.actionType === "fines" ? "selected" : ""}>Fines</option>
              <option value="charges" ${currentState.actionType === "charges" ? "selected" : ""}>Charges</option>
              <option value="arrests" ${currentState.actionType === "arrests" ? "selected" : ""}>Arrests</option>
            </select>
          </div>

          <div class="control-group" id="state-control">
            <label>Select State (Optional)</label>
            <select id="state-select">
              <option value="">All States</option>
              <option value="NSW">New South Wales</option>
              <option value="VIC">Victoria</option>
              <option value="QLD">Queensland</option>
              <option value="WA">Western Australia</option>
              <option value="SA">South Australia</option>
              <option value="TAS">Tasmania</option>
              <option value="NT">Northern Territory</option>
              <option value="ACT">Australian Capital Territory</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Dashboard Content -->
    <section class="dashboard-layout">
      <div class="dashboard-container" id="dashboardContainer"></div>
    </section>
  `;

  const yearSlider = document.getElementById("yearSlider");
  const yearDisplay = document.getElementById("year-display");
  const actionTypeSelect = document.getElementById("actionTypeSelect");
  const stateSelect = document.getElementById("state-select");
  const dashboardContainer = document.getElementById("dashboardContainer");

  // Toggle category buttons
  document.getElementById("btnAge").onclick = () => switchCategory("age");
  document.getElementById("btnPopulation").onclick = () => switchCategory("population");

  yearSlider.oninput = (e) => {
    currentState.year = +e.target.value;
    yearDisplay.textContent = currentState.year;
    renderCharts();
  };

  actionTypeSelect.onchange = (e) => {
    currentState.actionType = e.target.value;
    renderCharts();
  };

  stateSelect.onchange = (e) => {
    currentState.selectedState = e.target.value || null;
    renderCharts();
  };

  function switchCategory(category) {
    currentState.category = category;
    renderCategoryPage(category); // rerender whole page with selected tab
  }

  function clearDashboard() {
    dashboardContainer.innerHTML = "";
  }

  function renderCharts() {
    clearDashboard();

    if (currentState.category === "population") {
      dashboardContainer.innerHTML = `
    <div class="chart-container">
      <h3 class="chart-title">Australia Enforcement Map</h3>
      <div id="map-chart"></div>
    </div>
    <div class="chart-container">
      <h3 class="chart-title">State Comparison</h3>
      <div id="dualAxis"></div>
    </div>
    <div class="chart-container">
      <h3 class="chart-title">Detection Methods</h3>
      <div id="pie"></div>
    </div>
    <div class="chart-container">
      <h3 class="chart-title">Urban vs Regional vs Remote</h3>
      <div id="stackedBar"></div>
    </div>
  `;

      // Render population charts
      renderMap("#map-chart", mergedData, geoData, {
        year: currentState.year,
        actionType: currentState.actionType,
        onStateSelect: (state) => {
          currentState.selectedState = state;
          renderCharts();
        }
      });

      renderDualAxisBar("#dualAxis", mergedData, { year: currentState.year, actionType: currentState.actionType, state: currentState.selectedState });
      renderPieChart("#pie", mergedData, { year: currentState.year });
      renderStackedBarChart("#stackedBar", mergedData, { year: currentState.year });
    } else { // AGE
      dashboardContainer.innerHTML = `
        <div class="chart-container">
          <h3 class="chart-title">The Urban-Regional Demographic Intersection</h3>
          <div id="heatmap"></div>
        </div>
        <div class="chart-container">
          <h3 class="chart-title">Trend of Mobile Phone Offences</h3>
          <div id="lineChart"></div>
        </div>
        <div class="chart-container">
          <h3 class="chart-title">Fines per 100k Residents by Age Group</h3>
          <div id="ageFinesBar"></div>
        </div>
        <div class="chart-container">
          <h3 class="chart-title">Enforcement Bias: Urban vs Regional vs Remote</h3>
          <div id="enforcementBiasBar"></div>
        </div>
      `;

      const filtered = filterByYear(ageData, currentState.year);
      renderHeatmap("#heatmap", filtered, { year: currentState.year });
      renderLineChart("#lineChart", ageData);
      renderAgeFinesBar("#ageFinesBar", ageData, { year: currentState.year });
      renderEnforcementBiasBar("#enforcementBiasBar", ageData, { year: currentState.year });
    }
  }

  renderCharts();
}