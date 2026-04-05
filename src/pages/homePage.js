/**
 * src/pages/homePage.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Home page with dataset overview and navigation
 */

export function renderHomePage() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-container">
        <div class="hero-badge">
          <span class="pulse"></span>
          COS30045 Data Visualisation · HCMC Group 3
        </div>

        <h1>
          Mobile phone-use<br />
          offences across <em>Australia</em>
        </h1>

        <p>
          Analysing and visualising police enforcement data spanning 2008 to 2024. 
          Explore trends, jurisdictions, enforcement actions, and location-based patterns.
        </p>
      </div>
    </section>

    <!-- Dataset Overview -->
    <section class="section">
      <div class="section-container">
        <h2>Project Overview</h2>

        <p class="section-text">
          This project focuses on analysing and visualising mobile phone-use offences across Australia, using police 
          enforcement data spanning 2008 to 2024. With increasing reliance on mobile devices, distracted driving has 
          become a major road safety concern. Governments and law enforcement agencies impose fines, arrests, and charges 
          to deter such behaviour; however, patterns and trends are not always interpretable in raw datasets without 
          effective visualisation.
        </p>

        <p class="section-text">
          The target audience includes <strong>policymakers</strong>, <strong>road safety analysts</strong>, and the 
          <strong>general public</strong>. Policymakers can evaluate enforcement effectiveness, analysts can identify 
          trends and anomalies, and the public gains awareness of risks and penalties associated with mobile phone use 
          while driving.
        </p>

        <h3>What You Can Explore:</h3>
        <ul class="section-text">
          <li>Trends in mobile phone infringement fines over time (2008–2024)</li>
          <li>Enforcement levels compared across jurisdictions (8 states and territories)</li>
          <li>Differences in enforcement actions (fines vs charges vs arrests)</li>
          <li>Violations by location type and population-normalised rates</li>
          <li>Age group demographics and geographic distribution patterns</li>
        </ul>
      </div>
    </section>

    <!-- Category Selection -->
    <section class="section" style="background: var(--navy); padding: 60px 32px;">
      <div class="section-container">
        <h2 style="text-align: center; margin-bottom: 40px;">Explore the Data</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; max-width: 900px; margin: 0 auto;">
          <div style="border: 1px solid var(--border); border-radius: 10px; padding: 24px; background: var(--card); text-align: center; cursor: pointer; transition: all 0.3s ease;" onclick="window.app.navigate('category', 'age')"
            onmouseover="this.style.borderColor='var(--accent)'; this.style.background='rgba(59,130,246,0.1)'"
            onmouseout="this.style.borderColor='var(--border)'; this.style.background='var(--card)'">
            <div style="font-size: 32px; margin-bottom: 12px;">📊</div>
            <h3 style="color: var(--text); margin-bottom: 8px;">Age Group Demographics</h3>
            <p style="font-size: 12px; color: var(--sub); margin: 0;">Analyse offence patterns by age group</p>
          </div>

          <div style="border: 1px solid var(--border); border-radius: 10px; padding: 24px; background: var(--card); text-align: center; cursor: pointer; transition: all 0.3s ease;" onclick="window.app.navigate('category', 'population')"
            onmouseover="this.style.borderColor='var(--accent)'; this.style.background='rgba(59,130,246,0.1)'"
            onmouseout="this.style.borderColor='var(--border)'; this.style.background='var(--card)'">
            <div style="font-size: 32px; margin-bottom: 12px;">🗺️</div>
            <h3 style="color: var(--text); margin-bottom: 8px;">Geographic Distribution</h3>
            <p style="font-size: 12px; color: var(--sub); margin: 0;">Compare enforcement across states and territories</p>
          </div>
        </div>
      </div>
    </section>
  `;
}
