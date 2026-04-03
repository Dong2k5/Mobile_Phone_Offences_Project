/**
 * src/pages/categoryPage.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Main analysis dashboard with interactive controls and visualizations
 */

import { renderMap } from "../visualizations/mapChart.js";
import { renderBarChart } from "../visualizations/barChart.js";
import { renderPieChart } from "../visualizations/pieChart.js";
import { renderLineChart } from "../visualizations/lineChart.js";

let currentState = {
  category: "population",
  year: 2020,
  actionType: "fines",
  selectedState: null,
};

export function renderCategoryPage(initialCategory = "population") {
  currentState.category = initialCategory;

  const content = document.getElementById("content");
  content.innerHTML = `
    <!-- Category Selection -->
    <section class="category-section">
      <div class="category-container">
        <h1>Select Analysis Category</h1>
        
        <div class="category-buttons">
          <button class="category-btn ${currentState.category === "age" ? "active" : ""}" 
            onclick="window.categoryPage.selectCategory('age')">
            <span>📊</span> Age Group Distribution
          </button>
          
          <button class="category-btn ${currentState.category === "population" ? "active" : ""}" 
            onclick="window.categoryPage.selectCategory('population')">
            <span>🗺️</span> Population-Based Analysis
          </button>
        </div>
      </div>
    </section>

    <!-- Controls -->
    <section class="controls-section">
      <div class="controls-container">
        <div class="controls-grid">
          <div class="control-group">
            <label>Year</label>
            <input 
              type="range" 
              min="2008" 
              max="2024" 
              value="${currentState.year}" 
              onchange="window.categoryPage.updateYear(this.value)"
              style="width: 100%;">
            <div style="margin-top: 8px; text-align: center; font-size: 12px; color: var(--light);">
              <strong id="year-display">${currentState.year}</strong>
            </div>
          </div>

          <div class="control-group">
            <label>Enforcement Type</label>
            <select onchange="window.categoryPage.updateActionType(this.value)">
              <option value="fines" ${currentState.actionType === "fines" ? "selected" : ""}>Fines</option>
              <option value="charges" ${currentState.actionType === "charges" ? "selected" : ""}>Charges</option>
              <option value="arrests" ${currentState.actionType === "arrests" ? "selected" : ""}>Arrests</option>
            </select>
          </div>

          <div class="control-group" ${currentState.category === "age" ? 'style="display: none;"' : ''} id="state-control">
            <label>Select State (Optional)</label>
            <select id="state-select" onchange="window.categoryPage.updateSelectedState(this.value)">
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
      <div class="dashboard-container">
        ${
          currentState.category === "population"
            ? `
          <div class="chart-container">
            <h3 class="chart-title">Australia Enforcement Map</h3>
            <div id="map-chart"></div>
          </div>

          <div class="chart-container">
            <h3 class="chart-title">State Comparison</h3>
            <div id="bar-chart"></div>
          </div>

          <div class="chart-container">
            <h3 class="chart-title">Enforcement Trend (16 Years)</h3>
            <div id="line-chart"></div>
          </div>

          <div class="chart-container">
            <h3 class="chart-title">16-Year Summary</h3>
            <div id="summary-stats" style="padding: 20px;"></div>
          </div>
          `
            : `
          <div class="chart-container" style="grid-column: 1 / -1;">
            <h3 class="chart-title">Age Group Distribution</h3>
            <div id="pie-chart"></div>
          </div>

          <div class="chart-container">
            <h3 class="chart-title">Enforcement Trend (16 Years)</h3>
            <div id="line-chart-age"></div>
          </div>

          <div class="chart-container">
            <h3 class="chart-title">Analysis Notes</h3>
            <div id="analysis-notes" style="padding: 20px; font-size: 12px; color: var(--sub); line-height: 1.6;"></div>
          </div>
          `
        }
      </div>
    </section>
  `;

  // Initialize visualizations
  window.categoryPage = {
    selectCategory,
    updateYear,
    updateActionType,
    updateSelectedState,
    renderCharts,
  };

  renderCharts();
}

function selectCategory(category) {
  currentState.category = category;
  renderCategoryPage(category);
}

function updateYear(year) {
  currentState.year = parseInt(year);
  document.getElementById("year-display").textContent = year;
  renderCharts();
}

function updateActionType(actionType) {
  currentState.actionType = actionType;
  renderCharts();
}

function updateSelectedState(state) {
  currentState.selectedState = state || null;
  renderCharts();
}

function renderCharts() {
  if (currentState.category === "population") {
    renderMap("map-chart", currentState.year, currentState.actionType, (state) => {
      currentState.selectedState = state;
      renderCharts();
    });

    renderBarChart("bar-chart", currentState.year, currentState.actionType, currentState.selectedState);
    renderLineChart("line-chart");

    // Summary stats
    const statsDiv = document.getElementById("summary-stats");
    statsDiv.innerHTML = `
      <p style="margin: 0 0 8px 0; font-size: 12px;"><strong>Total Fines (2008–2024):</strong> ~1.04M</p>
      <p style="margin: 0 0 8px 0; font-size: 12px;"><strong>Growth Rate:</strong> +204% over 16 years</p>
      <p style="margin: 0; font-size: 12px;"><strong>Peak Year:</strong> 2024 with 563.7K fines nation-wide</p>
    `;
  } else {
    renderPieChart("pie-chart");
    renderLineChart("line-chart-age");

    const notesDiv = document.getElementById("analysis-notes");
    notesDiv.innerHTML = `
      <p style="margin: 0 0 12px 0;">
        <strong>Age Distribution:</strong> The 25–39 age group represents the largest share at 38% of all fines, 
        followed by 40–54 (24%) and under 25 (22%).
      </p>
      <p style="margin: 0;">
        <strong>Risk Pattern:</strong> Younger drivers (under 25) show disproportionately high rates relative to population, 
        suggesting mobile phone usage is particularly prevalent among this demographic while driving.
      </p>
    `;
  }
}
