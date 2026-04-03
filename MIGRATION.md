# PhoneSafe AU - HTML + D3.js Version

## Migration from React to Vanilla JavaScript

This is the new vanilla JavaScript version of PhoneSafe AU, using **D3.js** for all data visualizations instead of React/Vite.

### Key Changes

✅ **Removed:**
- React and JSX components
- Vite build system
- npm dependencies (React, React DOM, Vite)
- Tailwind CSS compilation

✅ **Added:**
- Pure vanilla JavaScript with ES6 modules
- D3.js v7 for interactive visualizations
- Vanilla CSS with design token variables
- Simple HTML + CSS + JavaScript stack

### Project Structure

```
phonesafe-au/
├── index.html                 # Main entry point
├── styles/
│   └── main.css              # All styling (vanilla CSS)
├── src/
│   ├── main.js               # App initialization & routing
│   ├── data.js               # Data module & utilities
│   ├── pages/
│   │   ├── navbar.js         # Navigation bar
│   │   ├── footer.js         # Footer
│   │   ├── homePage.js       # Home page
│   │   ├── categoryPage.js   # Analysis dashboard
│   │   └── aboutPage.js      # About page
│   └── visualizations/
│       ├── mapChart.js       # D3.js Australia map
│       ├── barChart.js       # D3.js bar chart
│       ├── pieChart.js       # D3.js pie chart
│       └── lineChart.js      # D3.js line chart
```

### Running the Application

#### Option 1: Simple HTTP Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (http-server)
npx http-server -p 8000
```

Then open `http://localhost:8000` in your browser.

#### Option 2: VS Code Live Server
- Install the "Live Server" extension
- Right-click `index.html` and select "Open with Live Server"

#### Option 3: Direct File Opening
- Simply open `index.html` in your browser (file://)
- ⚠️ Some features may not work due to CORS restrictions

### Features

📊 **Interactive Visualizations:**
- **Australia Map:** Color-coded by enforcement intensity, clickable states
- **Bar Chart:** State-by-state enforcement comparison
- **Pie Chart:** Age group demographics
- **Line Chart:** 16-year enforcement trends

🎛️ **Dashboard Controls:**
- Year slider (2008-2024)
- Enforcement type selector (Fines, Charges, Arrests)
- State filter for focused analysis
- Category selection (Geographic vs Age Group)

🎨 **Design:**
- Responsive dark theme matching original design
- Smooth animations and transitions
- Mobile-friendly layout
- Accessible typography and colors

### Data

All enforcement data from the Australian Road Safety Datahub (2008-2024):
- **Fines:** Fixed penalties issued by police
- **Charges:** Formal criminal charges
- **Arrests:** Law enforcement custody/court proceedings

### Browser Compatibility

- Chrome/Chromium: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Edge: ✅ Full support
- IE 11: ❌ Not supported (uses ES6 modules)

### Performance

- **Bundle Size:** Minimal (just D3.js library)
- **Initial Load:** < 1 second
- **Interaction:** Smooth 60 fps animations
- **No Build Step:** Direct file serving

### Customization

#### Add New Data
Edit `src/data.js` and update `ENFORCEMENT_DATA`, `AGE_DATA`, or other constants.

#### Modify Colors
Update CSS variables in `styles/main.css`:
```css
:root {
  --navy: #0d1b2e;
  --accent: #3b82f6;
  /* etc */
}
```

#### Add New Visualizations
1. Create a new file in `src/visualizations/`
2. Import D3.js and data
3. Export a render function
4. Call it from the appropriate page

### Migration Notes

**Benefits of this approach:**
- ✅ No build tooling required
- ✅ Smaller JavaScript payload
- ✅ Focus on data and visualizations
- ✅ Easier to understand code flow
- ✅ Direct CSS styling without compilation

**Trade-offs:**
- ❌ No component reusability (but still organized by page)
- ❌ Manual state management
- ❌ No JSX templating convenience
- ❌ More verbose DOM operations

### Troubleshooting

**Charts not appearing?**
- Ensure D3.js loaded: Check browser console for library errors
- Check console for JavaScript errors
- Verify DOM element IDs match in HTML and JavaScript

**Tooltips not working?**
- Make sure you're not using `file://` protocol
- Use a local HTTP server instead

**Styling issues?**
- Clear browser cache (Ctrl+Shift+Delete)
- Check that `styles/main.css` is being loaded
- Verify CSS variables are defined in `:root`

### Future Enhancements

- [ ] Export data to CSV
- [ ] Print-friendly PDF generation
- [ ] Real-time data updates
- [ ] Advanced filtering and drill-down
- [ ] Custom chart exports
- [ ] Dark/Light theme toggle

---

For questions or contributions, refer to the project documentation or contact the development team.
