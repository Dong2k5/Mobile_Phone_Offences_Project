/**
 * src/pages/footer.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Footer component
 */

export function renderFooter() {
  const footer = document.getElementById("footer");
  footer.innerHTML = `
    <p>
      Data: <a href="https://datahub.roadsafety.gov.au/" target="_blank">datahub.roadsafety.gov.au</a> · 
      <a href="https://www.abs.gov.au/" target="_blank">abs.gov.au</a> · 12,179 records · 2008–2024
    </p>
    <p style="margin-top: 8px; font-size: 10px;">
      <strong>COS30045</strong> · HCMC Group 3 · 2026-HX01 · © 2026 PhoneSafe AU
    </p>
  `;
}
