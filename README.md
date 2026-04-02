# PhoneSafe AU — Mobile Phone Enforcement Dashboard

**COS30045 Data Visualisation · HCMC Group 3 · Semester 2026-HX01**

An interactive dashboard visualising mobile phone enforcement fines across Australia
from 2008 to 2024, including state-by-state comparison, age group breakdown, and a
dedicated COVID-19 paradox analysis panel.

---

## Tech stack

| Tool | Purpose | Why we chose it |
|------|---------|----------------|
| **React 18** | UI framework | Component model keeps map, sidebar and charts in sync via shared state |
| **Vite 5** | Dev server & bundler | Instant HMR, zero-config, fast production builds |
| **Chart.js 4 + react-chartjs-2** | Line, bar, doughnut charts | Lightweight, well-documented, easy to animate |
| **D3 v7** | SVG helpers & data utilities | Scale helpers, interpolation — we use it without the full DOM layer |
| **Tailwind CSS 3** | Utility-first styling | Rapid layout without fighting specificity; pairs with CSS variables for theming |
| **DM Serif Display + DM Sans** | Typography | Editorial serif headline + clean sans body — distinctive without being garish |

---

## Project structure

```
phonesafe-au/
├── index.html                  ← Vite entry, loads Google Fonts
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx                ← ReactDOM.createRoot
    ├── App.jsx                 ← Root: shared state (year, actionType, selState, covidOpen)
    ├── styles/
    │   └── globals.css         ← Design tokens, map transitions, animations
    ├── data/
    │   └── enforcement.js      ← ALL data + getYearData(), valueToColor(), helpers
    └── components/
        ├── Navbar.jsx          ← Sticky top nav with logo + course badge
        ├── Hero.jsx            ← Full-width headline + 4 stat cards
        ├── Dashboard.jsx       ← Two-column layout shell + controls + COVID toggle
        ├── AustraliaMap.jsx    ← SVG map with hover tooltip + click isolation
        ├── CovidPanel.jsx      ← Collapsible COVID insight panel + dual-axis chart
        ├── Sidebar.jsx         ← Stat cards + state ranking + trend + age charts
        └── Footer.jsx          ← Data source + course tags
```

---

## Quick start

### 1. Install dependencies
```bash
cd phonesafe-au
npm install
```

### 2. Start the dev server
```bash
npm run dev
```
Opens at **http://localhost:5173** with hot-module reload.

### 3. Build for production
```bash
npm run build        # outputs to /dist
npm run preview      # preview the production build locally
```

---

## Connecting your real data

All data lives in **`src/data/enforcement.js`** — one file, clearly labelled.

### Step 1 — Export from KNIME
After your KNIME cleaning pipeline, export a CSV with columns:
```
year, jurisdiction, fines, charges, arrests
```

### Step 2 — Replace ENFORCEMENT_DATA
Open `src/data/enforcement.js` and replace the `fines`, `charges`, and `arrests`
objects with your real figures. The helper `getYearData(type, year)` automatically
interpolates between any years you provide — you don't need to supply every year.

### Step 3 — Update AGE_DATA
Replace `AGE_DATA.values` with your real age-group percentages.

### Step 4 — Update COVID_DATA
Replace `COVID_DATA.fines` and `COVID_DATA.traffic` with your indexed series
(set 2019 = 100 as the baseline for both).

---

## Customisation guide

### Change the colour theme
Edit the CSS variables at the top of `src/styles/globals.css`:
```css
:root {
  --navy:   #0d1b2e;   /* page background */
  --accent: #3b82f6;   /* primary blue    */
  --light:  #93c5fd;   /* lighter accent  */
  /* ... */
}
```
And update `MAP_SHADES` in `enforcement.js` to match.

### Add a new chart page
1. Create `src/components/YourPage.jsx`
2. Import it in `App.jsx`
3. Add a nav link in `Navbar.jsx`

### Improve the map shapes
The SVG paths in `AustraliaMap.jsx` are simplified schematic shapes.
To use precise geographic boundaries:
1. Fetch Australia state topology from:
   `https://cdn.jsdelivr.net/npm/datamaps@0.5.10/src/js/data/aus.topo.json`
2. Use D3's `geoMercator()` projection to convert to SVG paths
3. Replace the `STATE_SHAPES` array with D3-generated `<path d="...">` strings

---

## Deployment

### Netlify (recommended — free)
```bash
npm run build
# Drag the /dist folder to netlify.com/drop
# Or connect your GitHub repo for auto-deploy
```

### GitHub Pages
```bash
npm install --save-dev gh-pages
# In package.json add: "homepage": "https://yourusername.github.io/phonesafe-au"
# Then: npm run build && npx gh-pages -d dist
```

### Vercel
```bash
npm install -g vercel
vercel
```

---

## Team members
- Nguyen Minh Kiet — 104761301
- Le Pham Tu Quynh — 104813697
- Nguyen Pham Minh Dong — 104773649
