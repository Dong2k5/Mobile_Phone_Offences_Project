// Centralized data loading + transformation

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// =====================
// CACHE (load once only)
// =====================
let cachedData = null;

// =====================
// LOAD ALL DATA
// =====================
export async function loadAllData() {

  const [data, geoData] = await Promise.all([
    d3.csv("src/data/mobile_phone_enforcement_age_all_states.csv", d => ({
      YEAR: +d.YEAR,
      AGE_GROUP: d.AGE_GROUP,
      FINES: +d.FINES,
      ARRESTS: +d.ARRESTS,
      CHARGES: +d.CHARGES,
      POPULATION: +d.POPULATION,
      JURISDICTION: d.JURISDICTION
    })),

    d3.json("src/data/australia-states.geojson")
  ]);

  return { ageData: data, mergedData: data, geoData };
}

// =====================
// HELPERS (TRANSFORMATIONS)
// =====================

// Unique years
export function getYears(data) {
  return [...new Set(data.map(d => d.YEAR))].sort((a, b) => a - b);
}

// Unique age groups
export function getAgeGroups(data) {
  return [...new Set(data.map(d => d.AGE_GROUP))];
}

// Filter by year
export function filterByYear(data, year) {
  return data.filter(d => d.YEAR === year);
}

// Aggregate totals by age group
export function getAgeDistribution(data, types = ["FINES", "ARRESTS", "CHARGES"]) {
  const result = {};

  data.forEach(d => {
    const total = types.reduce((sum, t) => sum + (d[t] || 0), 0);
    result[d.AGE_GROUP] = (result[d.AGE_GROUP] || 0) + total;
  });

  return Object.entries(result).map(([key, value]) => ({
    label: key,
    value: value
  }));
}

// Grouped data (for grouped bar)
export function getGroupedData(data) {
  return data.map(d => ({
    age: d.AGE_GROUP,
    fines: d.FINES,
    arrests: d.ARRESTS,
    charges: d.CHARGES
  }));
}

// Ratio data (per 100k)
export function getRatioData(data) {
  return data.map(d => ({
    age: d.AGE_GROUP,
    fines: d.FINES_PER_100K,
    arrests: d.ARRESTS_PER_100K,
    charges: d.CHARGES_PER_100K
  }));
}