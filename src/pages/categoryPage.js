// src/pages/categoryPage.js

import {
  loadAllData,
  getYears,
  getAgeGroups,
  filterByYear
} from "../data.js";

// Import your charts (you will adapt these)
import { renderAgeStackedBar } from "../visualizations/ageStackedBar.js";
import { renderAgePie } from "../visualizations/agePieChart.js";
import { renderAgeGroupedBar } from "../visualizations/ageGroupedBar.js";
import { renderAgeRatioBar } from "../visualizations/ageRatioBar.js";

export async function renderCategoryPage(container) {

  // =====================
  // LOAD DATA
  // =====================
  const { ageData } = await loadAllData();

  const years = getYears(ageData);
  const ageGroups = getAgeGroups(ageData);

  let selectedYear = Math.max(...years);
  let selectedAge = ageGroups[0];
  let selectedTypes = ["FINES", "ARRESTS", "CHARGES"];

  // =====================
  // LAYOUT
  // =====================
  container.innerHTML = `
        <div class="dashboard">

            <div class="controls">
                <label>
                    Year:
                    <select id="yearFilter"></select>
                </label>

                <label>
                    Age Group (Pie):
                    <select id="ageFilter"></select>
                </label>

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

        </div>
    `;

  // =====================
  // SELECT ELEMENTS
  // =====================
  const yearSelect = container.querySelector("#yearFilter");
  const ageSelect = container.querySelector("#ageFilter");

  // Populate year dropdown
  years.forEach(y => {
    const option = document.createElement("option");
    option.value = y;
    option.textContent = y;
    yearSelect.appendChild(option);
  });

  // Populate age dropdown
  ageGroups.forEach(a => {
    const option = document.createElement("option");
    option.value = a;
    option.textContent = a;
    ageSelect.appendChild(option);
  });

  yearSelect.value = selectedYear;
  ageSelect.value = selectedAge;

  // =====================
  // EVENTS
  // =====================
  yearSelect.addEventListener("change", () => {
    selectedYear = +yearSelect.value;
    updateCharts();
  });

  ageSelect.addEventListener("change", () => {
    selectedAge = ageSelect.value;
    updateCharts();
  });

  container.querySelectorAll("#typeCheckboxes input")
    .forEach(cb => {
      cb.addEventListener("change", () => {
        selectedTypes = Array.from(
          container.querySelectorAll("#typeCheckboxes input:checked")
        ).map(cb => cb.value);

        if (selectedTypes.length > 0) {
          updateCharts();
        }
      });
    });

  // =====================
  // UPDATE FUNCTION
  // =====================
  function updateCharts() {

    const filtered = filterByYear(ageData, selectedYear);

    // Clear old charts
    container.querySelector("#stackedBar").innerHTML = "";
    container.querySelector("#pieChart").innerHTML = "";
    container.querySelector("#groupedBar").innerHTML = "";
    container.querySelector("#ratioBar").innerHTML = "";

    // Render charts
    renderAgeStackedBar("#stackedBar", filtered, selectedTypes);
    renderAgePie("#pieChart", filtered, selectedAge, selectedTypes);
    renderAgeGroupedBar("#groupedBar", filtered);
    renderAgeRatioBar("#ratioBar", filtered);
  }

  // =====================
  // INITIAL RENDER
  // =====================
  updateCharts();
}