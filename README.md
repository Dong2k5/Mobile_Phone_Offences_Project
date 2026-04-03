# PhoneSafe AU — Mobile Phone Enforcement Dashboard

**COS30045 Data Visualization · HCMC Group 3 · Semester 2026-HX01**

An interactive dashboard visualising mobile phone enforcement fines across Australia
from 2008 to 2024, including state-by-state comparison and age group breakdown.

---

## Tech Stack

| Technology | Purpose | Why We Chose It |
|-----------|---------|-----------------|
| **HTML5** | Markup structure | Clean, semantic foundation |
| **CSS3** | Styling & animations | Design tokens for theming, smooth transitions |
| **JavaScript (ES6)** | Logic & interactivity | No build step required, direct execution |
| **D3.js v7** | Interactive visualizations | Powerful charting: map, bar, pie, line charts with smooth interactions |
| **Google Fonts** | Typography | DM Serif Display + DM Sans for editorial, professional appearance |

### Why No Framework?
- ✅ **Zero dependencies** - Minimal attack surface, no npm bloat
- ✅ **No build process** - Serve files directly over HTTP
- ✅ **Direct D3.js control** - Better for interactive data visualizations
- ✅ **Simpler debugging** - Code is transparent and easy to understand
- ✅ **Faster load times** - Small JavaScript payload, instant server startup

---

## Project Structure

```
phonesafe-au/
├── index.html                  ← Main entry point
├── styles/
│   └── main.css               ← Vanilla CSS with design tokens & animations
└── src/
    ├── main.js                ← Application bootstrap & routing
    ├── data.js                ← All datasets + utility functions
    ├── pages/                 ← Page rendering modules
    │   ├── navbar.js          ← Navigation bar
    │   ├── homePage.js        ← Landing page & overview
    │   ├── categoryPage.js    ← Analysis dashboard with controls
    │   ├── aboutPage.js       ← Project information
    │   └── footer.js          ← Footer section
    └── visualizations/        ← D3.js chart modules
        ├── mapChart.js        ← Interactive Australia map
        ├── barChart.js        ← State comparison bars
        ├── pieChart.js        ← Age group distribution
        └── lineChart.js       ← 16-year enforcement trends
```

---

## Quick Start

### Option 1: Python HTTP Server (Recommended)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Then open **http://localhost:8000**

### Option 2: Node.js
```bash
npx http-server -p 8000
```

### Option 3: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

**No npm install or build step required!**

---

## Data Structure

All enforcement data lives in **`src/data.js`**. Update the following objects:

```javascript
ENFORCEMENT_DATA = {
  fines:    { 2008: {...}, 2010: {...}, ... },
  charges:  { 2008: {...}, 2010: {...}, ... },
  arrests:  { 2008: {...}, 2010: {...}, ... }
}

AGE_DATA = {
  labels: ["<25", "25-39", "40-54", "55-64", "65+"],
  values: [22, 38, 24, 12, 4]
}
```

### Utility Functions
- `getYearData(type, year)` - Retrieve data for any year with interpolation
- `getTotal(data)` - Sum enforcement values across states
- `valueToColor(value, max)` - Map enforcement intensity to color palette
- `buildTrendTotals()` - Generate 16-year trend array

---

## Updating the Dashboard

### Change Colors/Theme
Edit CSS variables in `styles/main.css`:
```css
:root {
  --navy:    #0d1b2e;
  --accent:  #3b82f6;
  --text:    #e2e8f0;
  /* etc */
}
```

### Add a New Chart
1. Create `src/visualizations/myChart.js` with D3.js code
2. Import in the appropriate page module
3. Call `render(containerId)` from page render function

### Adding New Pages
1. Create module in `src/pages/myPage.js`
2. Export render function: `export function renderMyPage() { ... }`
3. Add routing case in `src/main.js`
4. Update navbar links

---

## Features

✅ **Interactive Australia Map**  
- Color-coded by enforcement intensity
- Click states to isolate on dashboard
- Hover tooltips with statistics

✅ **Dashboard Controls**  
- Year slider (2008-2024)
- Enforcement type selector (Fines/Charges/Arrests)
- Optional state filter for focused analysis
- Category toggle (Geographic vs Age Group)

✅ **Visualizations**  
- State comparison bar chart
- Age group distribution pie chart
- 16-year enforcement trend line chart
- State-by-state breakdown table

✅ **Analysis Insights**  
- Key statistics & findings
- Project methodology & citations

---

## Browser Support

| Browser | Status |
|---------|--------|
| Chrome/Edge | ✅ Full support |
| Firefox | ✅ Full support |
| Safari | ✅ Full support |
| IE 11 | ❌ Not supported (ES6 modules) |

---

## Connecting Your Real Data

---

## Connecting Your Real Data

All data lives in **`src/data.js`** — easy to update:

### Step 1 — Update Enforcement Data
Edit `src/data.js` and replace `ENFORCEMENT_DATA`:
```javascript
export const ENFORCEMENT_DATA = {
  fines: {
    2008: { NSW: 15.2, VIC: 12.5, QLD: 8.9, ... },
    2010: { NSW: 24.6, VIC: 19.8, QLD: 14.2, ... },
    // Add more years as needed
  },
  charges: { /* same structure */ },
  arrests: { /* same structure */ }
};
```

The `getYearData(type, year)` function automatically interpolates missing years.

### Step 2 — Update Age Group Data
Replace `AGE_DATA` in `src/data.js`:
```javascript
export const AGE_DATA = {
  labels: ["<25", "25-39", "40-54", "55-64", "65+"],
  values: [22, 38, 24, 12, 4]  // Your percentages
};
```

### Step 3 — Update Population Data (Optional)
Edit `STATE_POPULATION` for per-capita comparisons:
```javascript
export const STATE_POPULATION = {
  NSW: 8175368,
  VIC: 6681657,
  // ... etc
};
```

---

## Customization

### Change Theme Colors
Edit CSS variables in `styles/main.css`:
```css
:root {
  --navy:    #0d1b2e;    /* Background */
  --accent:  #3b82f6;    /* Primary blue */
  --light:   #93c5fd;    /* Lighter accent */
  --text:    #e2e8f0;    /* Main text */
  --sub:     #94a3b8;    /* Subtitle text */
  /* ... other variables ... */
}
```

### Modify Map Color Palette
Edit `MAP_SHADES` in `src/data.js`:
```javascript
export const MAP_SHADES = [
  "#16253B",  // Dark (low)
  "#253B5A",
  "#385C91",
  "#5B8BC1",
  "#7BA5D1",
  "#A8C4E8",
  "#D4E0F5"   // Light (high)
];
```

### Customize Visualizations
Each chart module in `src/visualizations/` exports a `render()` function:
```javascript
export function renderBarChart(containerId, year, actionType, selectedState) {
  // D3.js code here
}
```

Modify D3 scales, colors, margins, or add interactivity as needed.

### Add New Analysis Pages
1. Create `src/pages/myPage.js`
2. Export `renderMyPage()` function
3. Import in `src/main.js`
4. Add routing case:
```javascript
case "mypage":
  renderMyPage();
  break;
```
5. Add link in navbar HTML

---

## Deployment

### Local Testing
```bash
# No build step needed!
python -m http.server 8000
# Visit http://localhost:8000
```

### Netlify (Recommended)
1. Push code to GitHub
2. Connect repository at netlify.com
3. Build command: (leave blank)
4. Publish directory: `.`
5. Deploy!

### Vercel
```bash
npm install -g vercel
vercel
```

### GitHub Pages
```bash
# Add to your repository
# Then access at: https://username.github.io/phonesafe-au
```

---

## Performance Notes

- **No build step** = instant development
- **Single HTTP request** for initial page load
- **D3.js SVG rendering** = smooth 60fps animations
- **Bundle size** = ~300KB (D3.js) + ~50KB (code + CSS)
- **Zero npm dependencies** = no security vulnerabilities from packages

---

## Troubleshooting

**Charts not appearing?**
- Check browser console for JavaScript errors
- Ensure D3.js CDN is loaded: `<script src="https://d3js.org/d3.v7.min.js"></script>`
- Verify DOM element IDs match in HTML and JavaScript

**Styling issues?**
- Clear browser cache (Ctrl+Shift+Delete)
- Check that `styles/main.css` is loaded (Network tab)
- Verify CSS variables are defined in `:root`

**Unable to run locally?**
- Don't use `file://` protocol (CORS issues)
- Must serve via HTTP server (Python, Node, or Live Server)

---

## See Also

- [MIGRATION.md](MIGRATION.md) — Detailed React → Vanilla JS migration notes
- [Australian Road Safety Datahub](https://datahub.roadsafety.gov.au/)
- [D3.js Documentation](https://d3js.org/)

---

## Team Members

- Nguyen Minh Kiet — 104761301
- Le Pham Tu Quynh — 104813697
- Nguyen Pham Minh Dong — 104773649

---

**Last updated:** April 2026 | **Tech Stack:** HTML5 + CSS3 + Vanilla JS + D3.js v7

