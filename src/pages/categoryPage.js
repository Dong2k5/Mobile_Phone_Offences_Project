// src/pages/categoryPage.js

import {
  loadAllData,
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
  focusedChart: null,
};

// Define consistent color scheme for states
const STATE_COLOR = "#3B82F6"; // Primary blue color for all states

export async function renderCategoryPage(initialCategory = "population") {
  currentState.category = initialCategory;
  currentState.focusedChart = null;

  const container = document.getElementById("content");
  const { ageData, mergedData, geoData } = await loadAllData();

  // Add styles for consistent text colors and responsive design
  const styleId = "category-page-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      /* Consistent typography and spacing */
      .category-section h1 {
        font-size: 28px;
        font-weight: 600;
        color: var(--text);
        margin: 0 0 24px 0;
      }

      .chart-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--text);
        margin: 0;
        word-break: break-word;
        flex: 1;
      }

      .control-group label {
        font-size: 14px;
        font-weight: 500;
        color: var(--text);
        display: block;
        margin-bottom: 8px;
      }

      #year-display {
        color: var(--text);
        font-size: 13px;
      }

      .detail-btn {
        background-color: var(--accent, #3B82F6);
        color: white;
        border: none;
        border-radius: 6px;
        padding: 6px 12px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: opacity 0.2s;
        flex-shrink: 0;
      }

      .detail-btn:hover {
        opacity: 0.9;
      }

      .back-btn {
        background-color: var(--accent, #3B82F6);
        color: white;
        border: none;
        border-radius: 6px;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: opacity 0.2s;
        flex-shrink: 0;
      }

      .back-btn:hover {
        opacity: 0.9;
      }

      .chart-insights {
        padding: 16px;
        background-color: var(--surface);
        border-radius: 12px;
        border-left: 4px solid var(--accent, #3B82F6);
      }

      .chart-insights h4 {
        font-size: 14px;
        font-weight: 600;
        color: var(--text);
        margin: 0 0 8px 0;
      }

      .chart-insights p {
        font-size: 13px;
        color: var(--text-secondary, var(--text));
        margin: 0;
        line-height: 1.5;
      }

      /* Focused chart layout - responsive */
      .focused-chart-wrapper {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        align-items: start;
      }

      .focused-chart-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-height: 500px;
      }

      .focused-chart-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 16px;
        flex-wrap: wrap;
      }

      .focused-chart-container {
        flex: 1;
        min-height: 450px;
        background-color: var(--surface);
        border-radius: 12px;
        padding: 16px;
      }

      /* Responsive: Stack vertically on smaller screens */
      @media (max-width: 1400px) {
        .focused-chart-wrapper {
          grid-template-columns: 1fr;
        }

        .chart-insights {
          margin-top: 0;
        }
      }

      /* Dashboard grid - responsive */
      .dashboard-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
        gap: 24px;
      }

      @media (max-width: 1024px) {
        .dashboard-container {
          grid-template-columns: 1fr;
        }
      }

      .chart-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
        background-color: var(--surface);
        padding: 16px;
        border-radius: 12px;
        min-height: 350px;
      }

      .chart-container > div:first-child {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
      }

      .chart-container > div:last-child {
        flex: 1;
        min-height: 300px;
        overflow: hidden;
      }

      /* Ensure text is visible in dark mode */
      @media (prefers-color-scheme: dark) {
        .category-section h1,
        .chart-title,
        .control-group label,
        #year-display,
        .chart-insights h4,
        .chart-insights p {
          color: #f0f0f0;
        }

        select, input[type="range"] {
          color: #f0f0f0;
          background-color: var(--bg-secondary, #2a2a2a);
        }
      }

      @media (prefers-color-scheme: light) {
        .category-section h1,
        .chart-title,
        .control-group label,
        #year-display,
        .chart-insights h4,
        .chart-insights p {
          color: #1f2937;
        }

        select, input[type="range"] {
          color: #1f2937;
        }
      }
    `;
    document.head.appendChild(style);
  }

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
            <div style="margin-top: 8px; text-align: center;">
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
    currentState.focusedChart = null;
    renderCategoryPage(category);
  }

  function clearDashboard() {
    const dashboardContainer = document.getElementById("dashboardContainer");
    if (dashboardContainer) {
      dashboardContainer.innerHTML = "";
    }
  }

  function focusChart(chartId) {
    currentState.focusedChart = chartId;
    renderCharts();
  }

  function renderChartDetails(chartId) {
    switch (chartId) {
      case "map":
        return "Explore enforcement levels across Australia. Click a state on the map to filter data and inspect regional enforcement patterns.";
      case "dualAxis":
        return "Compare state-level enforcement trends with fines and charges together for the selected year.";
      case "pie":
        return "Review the breakdown of detection methods used in mobile phone offences.";
      case "stackedBar":
        return "Analyze how enforcement differs between urban, regional and remote areas.";
      case "heatmap":
        return "See the distribution of offences across age groups and regions.";
      case "lineChart":
        return "Follow the trend of mobile phone offences over time.";
      case "ageFinesBar":
        return "Compare fines per 100k residents in each age group for the selected year.";
      case "enforcementBiasBar":
        return "Examine enforcement bias between urban, regional and remote areas.";
      default:
        return "";
    }
  }

  function renderFocusedChart() {
    const chartId = currentState.focusedChart;
    const focusedContainer = document.getElementById("dashboardContainer");

    if (!chartId || !focusedContainer) return;

    let title = "";
    let chartDiv = "";
    let renderFn = null;

    if (currentState.category === "population") {
      if (chartId === "map") {
        title = "Australia Enforcement Map";
        chartDiv = "map-chart";
        renderFn = () => renderMap(`#${chartDiv}`, mergedData, geoData, {
          year: currentState.year,
          actionType: currentState.actionType,
          onStateSelect: (state) => {
            currentState.selectedState = state;
            renderCharts();
          }
        });
      } else if (chartId === "dualAxis") {
        title = "State Comparison";
        chartDiv = "dualAxis";
        renderFn = () => renderDualAxisBar(`#${chartDiv}`, mergedData, {
          year: currentState.year,
          actionType: currentState.actionType,
          state: currentState.selectedState
        });
      } else if (chartId === "pie") {
        title = "Detection Methods";
        chartDiv = "pie";
        renderFn = () => renderPieChart(`#${chartDiv}`, mergedData, { year: currentState.year });
      } else if (chartId === "stackedBar") {
        title = "Urban vs Regional vs Remote";
        chartDiv = "stackedBar";
        renderFn = () => renderStackedBarChart(`#${chartDiv}`, mergedData, { year: currentState.year });
      }
    } else {
      if (chartId === "heatmap") {
        title = "The Urban-Regional Demographic Intersection";
        chartDiv = "heatmap";
        renderFn = () => renderHeatmap(`#${chartDiv}`, filterByYear(ageData, currentState.year), { year: currentState.year });
      } else if (chartId === "lineChart") {
        title = "Trend of Mobile Phone Offences";
        chartDiv = "lineChart";
        renderFn = () => renderLineChart(`#${chartDiv}`, ageData);
      } else if (chartId === "ageFinesBar") {
        title = "Fines per 100k Residents by Age Group";
        chartDiv = "ageFinesBar";
        renderFn = () => renderAgeFinesBar(`#${chartDiv}`, ageData, { year: currentState.year });
      } else if (chartId === "enforcementBiasBar") {
        title = "Enforcement Bias: Urban vs Regional vs Remote";
        chartDiv = "enforcementBiasBar";
        renderFn = () => renderEnforcementBiasBar(`#${chartDiv}`, ageData, { year: currentState.year });
      }
    }

    focusedContainer.innerHTML = `
      <div class="focused-chart-wrapper">
        <div class="focused-chart-content">
          <div class="focused-chart-header">
            <button id="btnBack" class="back-btn">← Back</button>
            <h3 class="chart-title">${title}</h3>
          </div>
          <div class="focused-chart-container">
            <div id="${chartDiv}" style="width: 100%; height: 100%;"></div>
          </div>
        </div>
        <div class="chart-insights">
          <h4>Insights</h4>
          <p>${renderChartDetails(chartId)}</p>
        </div>
      </div>
    `;

    document.getElementById("btnBack").onclick = () => {
      currentState.focusedChart = null;
      renderCharts();
    };

    if (renderFn) {
      renderFn();
    }
  }

  function renderCharts() {
    clearDashboard();

    const dashboardContainer = document.getElementById("dashboardContainer");
    if (!dashboardContainer) return;

    if (currentState.focusedChart) {
      renderFocusedChart();
      return;
    }

    if (currentState.category === "population") {
      dashboardContainer.innerHTML = `
        <div class="chart-container">
          <div>
            <h3 class="chart-title">Australia Enforcement Map</h3>
            <button class="detail-btn" data-chart="map">View Details</button>
          </div>
          <div id="map-chart"></div>
        </div>
        <div class="chart-container">
          <div>
            <h3 class="chart-title">State Comparison</h3>
            <button class="detail-btn" data-chart="dualAxis">View Details</button>
          </div>
          <div id="dualAxis"></div>
        </div>
        <div class="chart-container">
          <div>
            <h3 class="chart-title">Detection Methods</h3>
            <button class="detail-btn" data-chart="pie">View Details</button>
          </div>
          <div id="pie"></div>
        </div>
        <div class="chart-container">
          <div>
            <h3 class="chart-title">Urban vs Regional vs Remote</h3>
            <button class="detail-btn" data-chart="stackedBar">View Details</button>
          </div>
          <div id="stackedBar"></div>
        </div>
      `;

      dashboardContainer.querySelectorAll(".detail-btn").forEach((button) => {
        button.onclick = () => focusChart(button.dataset.chart);
      });

      renderMap("#map-chart", mergedData, geoData, {
        year: currentState.year,
        actionType: currentState.actionType,
        onStateSelect: (state) => {
          currentState.selectedState = state;
          renderCharts();
        }
      });

      renderDualAxisBar("#dualAxis", mergedData, {
        year: currentState.year,
        actionType: currentState.actionType,
        state: currentState.selectedState
      });

      renderPieChart("#pie", mergedData, { year: currentState.year });
      renderStackedBarChart("#stackedBar", mergedData, { year: currentState.year });
    } else {
      dashboardContainer.innerHTML = `
        <div class="chart-container">
          <div>
            <h3 class="chart-title">The Urban-Regional Demographic Intersection</h3>
            <button class="detail-btn" data-chart="heatmap">View Details</button>
          </div>
          <div id="heatmap"></div>
        </div>
        <div class="chart-container">
          <div>
            <h3 class="chart-title">Trend of Mobile Phone Offences</h3>
            <button class="detail-btn" data-chart="lineChart">View Details</button>
          </div>
          <div id="lineChart"></div>
        </div>
        <div class="chart-container">
          <div>
            <h3 class="chart-title">Fines per 100k Residents by Age Group</h3>
            <button class="detail-btn" data-chart="ageFinesBar">View Details</button>
          </div>
          <div id="ageFinesBar"></div>
        </div>
        <div class="chart-container">
          <div>
            <h3 class="chart-title">Enforcement Bias: Urban vs Regional vs Remote</h3>
            <button class="detail-btn" data-chart="enforcementBiasBar">View Details</button>
          </div>
          <div id="enforcementBiasBar"></div>
        </div>
      `;

      dashboardContainer.querySelectorAll(".detail-btn").forEach((button) => {
        button.onclick = () => focusChart(button.dataset.chart);
      });

      const filtered = filterByYear(ageData, currentState.year);
      renderHeatmap("#heatmap", filtered, { year: currentState.year });
      renderLineChart("#lineChart", ageData);
      renderAgeFinesBar("#ageFinesBar", ageData, { year: currentState.year });
      renderEnforcementBiasBar("#enforcementBiasBar", ageData, { year: currentState.year });
    }
  }

  renderCharts();
}