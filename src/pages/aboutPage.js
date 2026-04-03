/**
 * src/pages/aboutPage.js
 * ─────────────────────────────────────────────────────────────────────────────
 * About page with project information
 */

export function renderAboutPage() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <section class="section">
      <div class="about-content">
        <div class="about-section">
          <p style="font-size: 11px; color: var(--light); letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 24px;">
            COS30045 Data Visualisation · HCMC Group 3 · Semester 2026-HX01 · Monday 1–4 pm
          </p>

          <h2>About This Project</h2>
          <p>
            This project focuses on analysing and visualising mobile phone-use offences across Australia, using police 
            enforcement data spanning 2008 to 2024. With the increasing reliance on mobile devices, distracted driving has 
            become a major road safety concern. Governments and law enforcement agencies impose fines, arrests, and charges 
            to deter such behaviour; however, patterns and trends in these offences are not always easily interpretable in 
            raw datasets without effective visualisation.
          </p>
          <p>
            The target audience for this visualisation includes policymakers, road safety analysts, and the general public. 
            Policymakers can use the insights to evaluate enforcement effectiveness, while analysts can identify trends and 
            anomalies. The general public benefits from greater awareness of the risks and penalties associated with mobile 
            phone use while driving.
          </p>
          <p>
            The visualisation addresses the problem of fragmented and non-intuitive data representation by transforming 
            multidimensional enforcement records into a clear, interactive format. Users can explore trends in mobile phone 
            infringement fines over time, compare enforcement levels across jurisdictions, analyse differences in enforcement 
            actions, and examine how violations vary by location type and population-normalised rates.
          </p>
        </div>

        <div class="about-section">
          <h2>Data Sources</h2>
          
          <h3>Dataset 1 · Police Enforcement</h3>
          <p>
            <strong><a href="https://datahub.roadsafety.gov.au/safe-systems/safe-road-use/police-enforcement" target="_blank" style="color: var(--light);">
            Australian Government Road Safety Data Hub</a></strong>
          </p>
          <p>
            Official Australian government open-data platform for police enforcement and road safety. Contains records of 
            mobile phone usage offences while driving, covering all states and territories from 2008 to 2024 (12,179 records).
          </p>

          <h3>Dataset 2 · Population Statistics</h3>
          <p>
            <strong><a href="https://www.abs.gov.au/statistics/people/population/national-state-and-territory-population/latest-release" target="_blank" style="color: var(--light);">
            Australian Bureau of Statistics — National, State and Territory Population</a></strong>
          </p>
          <p>
            Contains annual national, state, and territory population estimates for Australia. Used to compute population-normalised 
            enforcement rates (fines, arrests, and charges per 100,000 population) to enable fair cross-jurisdiction comparison.
          </p>
        </div>

        <div class="about-section">
          <h2>Data Processing</h2>
          <p>
            Both datasets were cleaned, transformed, and merged using a combination of KNIME Analytics Platform and Python 
            (Jupyter Notebook). The KNIME workflow handled missing value imputation, standardisation of aggregated category 
            labels ("All ages" → "Missing", "All regions" → "Missing", "Unknown" → "Others"), duplicate removal, and filtering 
            to the mobile_phone_use metric exclusively.
          </p>
          <p>
            Python was used for population data preparation — reshaping the ABS dataset to long format (YEAR, JURISDICTION, POPULATION), 
            computing yearly averages, and joining with the enforcement dataset on standardised keys. Population-normalised rates 
            (per 100,000 population) were then derived to support fair cross-jurisdictional analysis.
          </p>
        </div>

        <div class="about-section">
          <h2>Technology Stack</h2>
          <ul>
            <li><strong>KNIME Analytics Platform</strong> — Data cleaning & transformation</li>
            <li><strong>Python 3</strong> — Data processing</li>
            <li><strong>Jupyter Notebook</strong> — Interactive analysis</li>
            <li><strong>pandas</strong> — Data manipulation</li>
            <li><strong>D3.js</strong> — Interactive visualizations</li>
            <li><strong>HTML5 + CSS3</strong> — Markup & styling</li>
            <li><strong>Vanilla JavaScript</strong> — Application logic</li>
          </ul>
        </div>

        <div class="about-section">
          <h2>Design System</h2>
          <p>
            <strong>Colour Palette:</strong> Five-tone monochromatic blue palette — chosen to convey authority, clarity, and 
            road-safety seriousness. Accessible contrast ratios are maintained throughout for optimal readability.
          </p>
          <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-top: 16px; max-width: 400px;">
            <div style="padding: 16px; background: #16253B; border-radius: 6px; text-align: center; font-size: 10px; color: var(--light); border: 1px solid var(--border);">
              #16253B
            </div>
            <div style="padding: 16px; background: #253B5A; border-radius: 6px; text-align: center; font-size: 10px; color: var(--light); border: 1px solid var(--border);">
              #253B5A
            </div>
            <div style="padding: 16px; background: #385C91; border-radius: 6px; text-align: center; font-size: 10px; color: var(--light); border: 1px solid var(--border);">
              #385C91
            </div>
            <div style="padding: 16px; background: #A8C4E8; border-radius: 6px; text-align: center; font-size: 10px; color: #0d1b2e; border: 1px solid var(--border);">
              #A8C4E8
            </div>
            <div style="padding: 16px; background: #FFFFFF; border-radius: 6px; text-align: center; font-size: 10px; color: #0d1b2e; border: 1px solid #ccc;">
              #FFFFFF
            </div>
          </div>
        </div>

        <div class="about-section">
          <h2>Team Members</h2>
          <div class="team-grid">
            <div class="team-member">
              <h3>NK</h3>
              <p><strong>Nguyen Minh Kiet</strong></p>
              <p>104761301</p>
            </div>
            <div class="team-member">
              <h3>LQ</h3>
              <p><strong>Le Pham Tu Quynh</strong></p>
              <p>104813697</p>
            </div>
            <div class="team-member">
              <h3>ND</h3>
              <p><strong>Nguyen Pham Minh Dong</strong></p>
              <p>104773649</p>
            </div>
          </div>
        </div>

        <div class="about-section" style="border-top: 1px solid var(--border); padding-top: 24px; margin-top: 32px;">
          <p style="font-size: 11px; color: var(--sub); text-align: center; margin: 0;">
            Data: datahub.roadsafety.gov.au · abs.gov.au · 12,179 records · 2008–2024
          </p>
          <p style="font-size: 11px; color: var(--sub); text-align: center; margin-top: 8px;">
            © 2026 PhoneSafe AU · Data visualisation project
          </p>
        </div>
      </div>
    </section>
  `;
}
