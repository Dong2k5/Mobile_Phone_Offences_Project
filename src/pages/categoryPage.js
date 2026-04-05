// src/pages/categoryPage.js

import {
  loadAllData,
  filterByYear,
  getYears
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
  const years = getYears(mergedData);
  if (!years.includes(currentState.year)) {
    currentState.year = years[years.length - 1];
  }

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
            <select id="yearSelect">
              ${years.map(year => `<option value="${year}" ${currentState.year === year ? "selected" : ""}>${year}</option>`).join("")}
            </select>
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

  const yearSelect = document.getElementById("yearSelect");
  const actionTypeSelect = document.getElementById("actionTypeSelect");
  const stateSelect = document.getElementById("state-select");

  document.getElementById("btnAge").onclick = () => switchCategory("age");
  document.getElementById("btnPopulation").onclick = () => switchCategory("population");

  yearSelect.onchange = (e) => {
    currentState.year = +e.target.value;
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
    const insightsData = {
      map: {
        context: "This map displays enforcement levels across Australian states and territories.",
        values: `Selected year: ${currentState.year} | Action type: ${currentState.actionType}`,
        insights: "NSW and VIC consistently have the highest total fines, driven by large populations and dense urban enforcement. SA shows disproportionately high fines per capita, indicating stronger enforcement intensity relative to population. Smaller regions like NT and TAS fluctuate heavily, suggesting less stable but occasionally concentrated enforcement."
      },
      dualAxis: {
        context: "Compares absolute enforcement numbers (bars) with population-normalized rates (line) across states.",
        values: `Year: ${currentState.year} | Bars: Total ${currentState.actionType} | Line: Per 100k residents`,
        insights: "High totals in NSW/VIC are population-driven, but SA and TAS often exceed them in per-capita rates, showing more aggressive enforcement relative to population size. This confirms enforcement is not evenly distributed — some states enforce more intensely, not just more frequently."
      },
      pie: {
        context: "Shows the proportion of mobile phone offences detected by different methods (camera vs police).",
        values: `Year: ${currentState.year} | Detection methods: Camera and Police Patrols`,
        insights: "2023 shows police-issued fines dominate almost entirely. 2024 reveals a massive shift to camera detection, especially in ACT, QLD, and VIC where camera becomes the dominant source. This indicates a system-wide transition to automated enforcement, not just gradual adoption."
      },
      stackedBar: {
        context: "Breaks down enforcement by location type: urban, regional, and remote areas.",
        values: `Year: ${currentState.year} | Categories: Urban, Regional, Remote`,
        insights: "Urban areas dominate enforcement volume across all states, especially NSW and VIC. However, regional areas consistently contribute a meaningful share. 'Remote' areas are minimal in NSW/VIC but dominant in NT, SA, WA — reflecting geographic structure more than enforcement bias alone. Enforcement distribution mirrors population but not perfectly."
      },
      heatmap: {
        context: "Shows offence intensity across age groups (rows) and location types (columns).",
        values: `Year: ${currentState.year} | Dimensions: Age Group × Location Type`,
        insights: "26–39 and 17–25 age groups consistently show the highest offence rates across all locations. 0–16 and 65+ groups are negligible, indicating lower offending or enforcement targeting. Urban + 26–39 is the strongest hotspot across almost every state. In some states (SA, TAS), 17–25 rivals or exceeds 26–39, suggesting youth-heavy enforcement patterns."
      },
      lineChart: {
        context: "Displays quarterly trends in mobile phone offences from 2023 to 2024, broken down by age group.",
        values: "Quarters: Q1 2023 – Q4 2024 | Measures: Combined fines, arrests, and charges",
        insights: "2023 → 2024 shows a sharp increase in total offences, especially from Q1 2024 onward. This spike aligns with the introduction of camera enforcement, not behavioral change alone. Some seasonal variation exists (slight dips mid-year, peaks in Q4 or Q1), but growth is structural, driven by policy and technology adoption rather than purely seasonal patterns."
      },
      ageFinesBar: {
        context: "Compares population-normalized fines per 100k residents for each age group.",
        values: `Year: ${currentState.year} | Metric: Fines per 100k population`,
        insights: "26–39 has the highest per-capita offence rate overall, making it the most targeted or most offending group. 17–25 is consistently second highest, especially strong in SA, TAS, and VIC. 40–64 is moderate but still significant. 65+ and 0–16 remain very low even after normalization, indicating real behavioral or enforcement differences, not just population effects."
      },
      enforcementBiasBar: {
        context: "Examines enforcement intensity across urban, regional, and remote areas relative to their populations.",
        values: `Year: ${currentState.year} | Metric: Enforcement rate by location type`,
        insights: "Urban areas still dominate even after normalization, meaning enforcement is not purely population-driven. Regional areas show comparable or higher per-capita rates in some states, indicating targeted enforcement outside cities. Remote areas show spikes in NT and WA, suggesting reactive, incident-based enforcement in smaller populations. Conclusion: there is mild urban bias, but also targeted regional and remote enforcement in certain states."
      }
    };

    const data = insightsData[chartId];
    if (!data) return "";

    return `
      <div style="margin-bottom: 16px;">
        <h5 style="margin: 0 0 8px 0; color: var(--accent); font-size: 12px; font-weight: 600; text-transform: uppercase;">Context</h5>
        <p style="margin: 0 0 12px 0; font-size: 13px; color: var(--text); line-height: 1.5;">${data.context}</p>
      </div>
      <div style="margin-bottom: 16px;">
        <h5 style="margin: 0 0 8px 0; color: var(--accent); font-size: 12px; font-weight: 600; text-transform: uppercase;">Values</h5>
        <p style="margin: 0 0 12px 0; font-size: 13px; color: var(--text); line-height: 1.5;">${data.values}</p>
      </div>
      <div>
        <h5 style="margin: 0 0 8px 0; color: var(--accent); font-size: 12px; font-weight: 600; text-transform: uppercase;">Insights</h5>
        <p style="margin: 0; font-size: 13px; color: var(--text); line-height: 1.5;">${data.insights}</p>
      </div>
    `;
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
          <div id="insights-content"></div>
        </div>
      </div>
    `;

    document.getElementById("btnBack").onclick = () => {
      currentState.focusedChart = null;
      renderCharts();
    };

    // Populate insights
    const insightsContent = document.getElementById("insights-content");
    if (insightsContent) {
      insightsContent.innerHTML = renderChartDetails(chartId);
    }

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