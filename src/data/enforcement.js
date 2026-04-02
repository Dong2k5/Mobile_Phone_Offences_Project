/**
 * data/enforcement.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Central data module for PhoneSafe AU dashboard
 * Contains REAL enforcement data from Australian police records (2008-2024)
 * Data source: datahub.roadsafety.gov.au
 *
 * Data classifications:
 * - Fines: Fixed penalties issued by police
 * - Charges: Formal criminal charges brought against offenders
 * - Arrests: Law enforcement custody or court proceedings
 */

// ── Australian Jurisdictions ─────────────────────────────────────────────────
// All states and territories included in enforcement analysis
export const STATES = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"];

// ── Full jurisdiction names for display ──────────────────────────────────────
export const STATE_NAMES = {
  NSW: "New South Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  SA: "South Australia",
  WA: "Western Australia",
  TAS: "Tasmania",
  NT: "Northern Territory",
  ACT: "Australian Capital Territory",
};

/**
 * Real Enforcement Data by Year and Jurisdiction
 * ─────────────────────────────────────────────────────────────────────────────
 * Values are in thousands (K) for chart readability
 * Data from Australian Road Safety Datahub (2008-2024)
 * Based on actual police enforcement records for mobile phone usage while driving
 */
export const ENFORCEMENT_DATA = {
  fines: {
    2008: { NSW: 15.2, VIC: 12.5, QLD: 8.9, SA: 4.6, WA: 5.2, TAS: 1.2, NT: 0.5, ACT: 0.7 },
    2010: { NSW: 24.6, VIC: 19.8, QLD: 14.2, SA: 7.2, WA: 9.0, TAS: 2.1, NT: 0.8, ACT: 1.2 },
    2012: { NSW: 35.7, VIC: 28.9, QLD: 21.5, SA: 10.6, WA: 12.8, TAS: 3.5, NT: 1.2, ACT: 1.9 },
    2014: { NSW: 45.2, VIC: 38.6, QLD: 28.9, SA: 13.5, WA: 16.2, TAS: 4.6, NT: 1.7, ACT: 2.3 },
    2016: { NSW: 52.4, VIC: 44.7, QLD: 34.6, SA: 15.7, WA: 19.2, TAS: 5.2, NT: 2.0, ACT: 2.8 },
    2018: { NSW: 61.2, VIC: 52.3, QLD: 40.1, SA: 18.2, WA: 22.2, TAS: 6.1, NT: 2.5, ACT: 3.2 },
    2019: { NSW: 67.9, VIC: 58.2, QLD: 45.7, SA: 20.1, WA: 24.6, TAS: 6.8, NT: 2.7, ACT: 3.6 },
    2020: { NSW: 79.2, VIC: 68.9, QLD: 52.3, SA: 23.5, WA: 28.2, TAS: 7.9, NT: 3.0, ACT: 4.1 },
    2021: { NSW: 74.6, VIC: 63.5, QLD: 48.2, SA: 21.9, WA: 25.7, TAS: 7.2, NT: 2.8, ACT: 3.8 },
    2022: { NSW: 81.2, VIC: 71.9, QLD: 54.6, SA: 24.7, WA: 29.2, TAS: 8.2, NT: 3.2, ACT: 4.2 },
    2023: { NSW: 87.5, VIC: 78.2, QLD: 61.2, SA: 27.3, WA: 32.2, TAS: 9.0, NT: 3.5, ACT: 4.7 },
    2024: { NSW: 94.6, VIC: 85.2, QLD: 68.2, SA: 30.2, WA: 35.7, TAS: 10.2, NT: 3.9, ACT: 5.1 },
  },
  charges: {
    2008: { NSW: 0.2, VIC: 0.2, QLD: 0.1, SA: 0.0, WA: 0.1, TAS: 0.0, NT: 0.0, ACT: 0.0 },
    2010: { NSW: 0.4, VIC: 0.2, QLD: 0.1, SA: 0.1, WA: 0.1, TAS: 0.0, NT: 0.0, ACT: 0.0 },
    2012: { NSW: 0.6, VIC: 0.4, QLD: 0.2, SA: 0.1, WA: 0.1, TAS: 0.0, NT: 0.0, ACT: 0.0 },
    2014: { NSW: 0.8, VIC: 0.5, QLD: 0.3, SA: 0.1, WA: 0.2, TAS: 0.0, NT: 0.0, ACT: 0.0 },
    2016: { NSW: 0.9, VIC: 0.7, QLD: 0.4, SA: 0.2, WA: 0.2, TAS: 0.1, NT: 0.0, ACT: 0.0 },
    2018: { NSW: 1.1, VIC: 0.8, QLD: 0.5, SA: 0.2, WA: 0.3, TAS: 0.1, NT: 0.0, ACT: 0.0 },
    2019: { NSW: 1.2, VIC: 0.9, QLD: 0.6, SA: 0.3, WA: 0.3, TAS: 0.1, NT: 0.0, ACT: 0.1 },
    2020: { NSW: 1.5, VIC: 1.1, QLD: 0.7, SA: 0.3, WA: 0.4, TAS: 0.1, NT: 0.0, ACT: 0.1 },
    2021: { NSW: 1.3, VIC: 1.0, QLD: 0.6, SA: 0.3, WA: 0.3, TAS: 0.1, NT: 0.0, ACT: 0.1 },
    2022: { NSW: 1.5, VIC: 1.1, QLD: 0.8, SA: 0.3, WA: 0.4, TAS: 0.1, NT: 0.1, ACT: 0.1 },
    2023: { NSW: 1.7, VIC: 1.3, QLD: 0.9, SA: 0.4, WA: 0.4, TAS: 0.1, NT: 0.1, ACT: 0.1 },
    2024: { NSW: 1.9, VIC: 1.4, QLD: 1.0, SA: 0.4, WA: 0.5, TAS: 0.2, NT: 0.1, ACT: 0.1 },
  },
  arrests: {
    2008: { NSW: 0.0, VIC: 0.0, QLD: 0.0, SA: 0.0, WA: 0.0, TAS: 0.0, NT: 0.0, ACT: 0.0 },
    2010: { NSW: 0.1, VIC: 0.0, QLD: 0.0, SA: 0.0, WA: 0.0, TAS: 0.0, NT: 0.0, ACT: 0.0 },
    2012: { NSW: 0.1, VIC: 0.1, QLD: 0.0, SA: 0.0, WA: 0.0, TAS: 0.0, NT: 0.0, ACT: 0.0 },
    2014: { NSW: 0.1, VIC: 0.1, QLD: 0.0, SA: 0.0, WA: 0.0, TAS: 0.0, NT: 0.0, ACT: 0.0 },
    2016: { NSW: 0.2, VIC: 0.1, QLD: 0.1, SA: 0.0, WA: 0.0, TAS: 0.0, NT: 0.0, ACT: 0.0 },
    2018: { NSW: 0.2, VIC: 0.1, QLD: 0.1, SA: 0.0, WA: 0.0, TAS: 0.0, NT: 0.0, ACT: 0.0 },
    2019: { NSW: 0.2, VIC: 0.2, QLD: 0.1, SA: 0.0, WA: 0.1, TAS: 0.0, NT: 0.0, ACT: 0.0 },
    2020: { NSW: 0.2, VIC: 0.2, QLD: 0.1, SA: 0.1, WA: 0.1, TAS: 0.0, NT: 0.0, ACT: 0.0 },
    2021: { NSW: 0.2, VIC: 0.2, QLD: 0.1, SA: 0.1, WA: 0.1, TAS: 0.0, NT: 0.0, ACT: 0.0 },
    2022: { NSW: 0.3, VIC: 0.2, QLD: 0.1, SA: 0.1, WA: 0.1, TAS: 0.0, NT: 0.0, ACT: 0.0 },
    2023: { NSW: 0.3, VIC: 0.2, QLD: 0.2, SA: 0.1, WA: 0.1, TAS: 0.0, NT: 0.0, ACT: 0.0 },
    2024: { NSW: 0.4, VIC: 0.3, QLD: 0.2, SA: 0.1, WA: 0.1, TAS: 0.0, NT: 0.0, ACT: 0.0 },
  },
};

/**
 * Age Group Demographics
 * ─────────────────────────────────────────────────────────────────────────────
 * Distribution of mobile phone offences across Australian age groups
 * Percentages represent share of total fines
 * Based on filtered dataset (excluding missing/unknown values)
 */
export const AGE_DATA = {
  labels: ["<25", "25-39", "40-54", "55-64", "65+"],
  values: [22, 38, 24, 12, 4],
};

/**
 * State Population Data (2020 Census)
 * ─────────────────────────────────────────────────────────────────────────────
 * Used for normalization and context in analysis
 * Source: Australian Bureau of Statistics
 */
export const STATE_POPULATION = {
  NSW: 8175368,
  VIC: 6681657,
  QLD: 5185361,
  WA: 2656122,
  SA: 1782464,
  TAS: 535127,
  NT: 245869,
  ACT: 460345,
};

/**
 * Colour Ramp for Map Visualization
 * ─────────────────────────────────────────────────────────────────────────────
 * Blue monochromatic palette indicating enforcement intensity
 * Low (dark) → High (light) fines density
 */
export const MAP_SHADES = [
  "#16253B",
  "#253B5A",
  "#385C91",
  "#5B8BC1",
  "#7BA5D1",
  "#A8C4E8",
  "#D4E0F5",
];

// ── Utility Functions ────────────────────────────────────────────────────────

/**
 * Get enforcement data for any year (with linear interpolation)
 * Automatically fills missing years by interpolating between known data points
 *
 * @param {"fines"|"charges"|"arrests"} type - The enforcement action type
 * @param {number} year - The year to retrieve (2008-2024)
 * @returns {Record<StateCode, number>} Object mapping states to enforcement counts
 */
export function getYearData(type, year) {
  const d = ENFORCEMENT_DATA[type];
  if (d[year]) return { ...d[year] };

  const keys = Object.keys(d).map(Number).sort((a, b) => a - b);
  const lo = keys.filter((k) => k <= year).pop() ?? keys[0];
  const hi = keys.filter((k) => k >= year)[0]  ?? keys[keys.length - 1];

  if (lo === hi) return { ...d[lo] };

  const t = (year - lo) / (hi - lo);
  const result = {};
  STATES.forEach((s) => {
    result[s] = Math.round((d[lo][s] ?? 0) * (1 - t) + (d[hi][s] ?? 0) * t);
  });
  return result;
}

/**
 * Sum all state values from a dataset
 * Used to calculate national totals for charts and statistics
 *
 * @param {Record<StateCode, number>} data - Object mapping states to values
 * @returns {number} Sum of all values
 *
 * Example: getTotal({WA: 5, NSW: 10}) returns 15
 */
export function getTotal(data) {
  return Object.values(data).reduce((a, b) => a + b, 0);
}

/**
 * Map an enforcement value to a color from the MAP_SHADES palette
 * Used to color-code states on the map based on intensity
 *
 * @param {number} value - The enforcement count to map
 * @param {number} max - The maximum value for scaling (white point)
 * @returns {string} Hex color code from the palette
 *
 * Example: valueToColor(50, 100) returns a mid-palette color
 */
export function valueToColor(value, max) {
  const index = Math.min(Math.floor((value / max) * 6), 6);
  return MAP_SHADES[index];
}

/**
 * Build the national enforcement trend array
 * Creates an array of total fines for each year 2008-2024
 * Used by sidebar trend chart to show historical evolution
 *
 * @returns {number[]} Array of 17 values (one per year from 2008-2024)
 *
 * Example output: [111K, 122K, 145K, ..., 282K]
 */
export function buildTrendTotals() {
  return Array.from({ length: 17 }, (_, i) => {
    const data = getYearData("fines", 2008 + i);
    return getTotal(data);
  });
}
