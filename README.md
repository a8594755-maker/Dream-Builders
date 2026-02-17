# Dream Builders Website

A professional project management website for Dream Builders, partnering with Sleep in Heavenly Peace (NRV) to support fundraising, bedding drives, and build-day coordination for children in need.

## Project Overview

This website serves as a comprehensive project management and communication hub for the Dream Builders project, which aims to:
- Support fundraising and community outreach
- Coordinate a bedding drive for 40 twin bed-in-a-bag sets
- Assist with April 25 main build event (target: 40 beds)
- Document project progress and lessons learned

## Website Structure

### Main Pages
- **Home**: Mission statement, progress tracking, goals, and call-to-action
- **Our Sponsors**: Partner information and donor recognition
- **Gallery**: Photo albums organized by project phases
- **Lessons Learned**: Project reflections and PM takeaways
- **Meeting Minutes**: Comprehensive meeting records and action items
- **Project Documentation**: Central repository for all PM documents

### Key Features
- Responsive design for mobile and desktop
- Professional navigation with mobile hamburger menu
- Interactive gallery with album filtering
- Comprehensive documentation library
- Progress tracking dashboards
- Print-friendly documentation pages

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with responsive grid layouts
- **Interactivity**: Vanilla JavaScript with modern DOM manipulation
- **Deployment**: Static site suitable for GitHub Pages

## File Structure

```
dream-builders/
├── index.html                    # Home page
├── sponsors.html                  # Our Sponsors page
├── gallery.html                   # Gallery page
├── lessons.html                   # Lessons Learned page
├── meeting-minutes/               # Meeting minutes section
│   ├── index.html                # Minutes index
│   ├── 2026-02-05.html           # Feb 5 minutes
│   └── 2026-02-09.html           # Feb 9 minutes
├── docs/                          # Documentation section
│   ├── index.html                # Documentation index
│   ├── timeline.html              # Project timeline
│   ├── bedding-drive.html        # Bedding drive plan
│   └── build-apr25.html          # April 25 build plan
├── assets/
│   ├── css/
│   │   └── style.css             # Main stylesheet
│   ├── js/
│   │   └── script.js             # Main JavaScript file
│   └── img/                       # Image assets
│       └── gallery/               # Gallery images by album
└── README.md                      # This file
```

## Setup Instructions

### Local Development

1. **Clone or download** the project files to your local machine
2. **Navigate** to the project directory:
   ```bash
   cd dream-builders
   ```
3. **Start a local server** (recommended):
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP (if you have PHP installed)
   php -S localhost:8000
   ```
4. **Open your browser** and navigate to:
   ```
   http://localhost:8000
   ```

### GitHub Pages Deployment

#### Option 1: User/Organization Pages
1. Create a new repository named `<username>.github.io`
2. Upload all files to the repository
3. Enable GitHub Pages in repository settings
4. Your site will be available at `https://<username>.github.io`

#### Option 2: Project Pages (Recommended)
1. Create a new repository (e.g., `dream-builders`)
2. Upload all files to the repository
3. Enable GitHub Pages in repository settings
4. Select source branch (usually `main`) and `/ (root)` folder
5. Your site will be available at `https://<username>.github.io/dream-builders`

## Customization Guide

### Updating Progress Numbers
Edit the progress cards in `index.html`:
```html
<div class="card-number">$1,250</div>  <!-- Update fundraising amount -->
<div class="card-number">15 / 40</div>  <!-- Update bedding collection -->
```

### Adding New Meeting Minutes
1. Create new HTML file in `meeting-minutes/` folder (e.g., `2026-02-16.html`)
2. Copy template from existing minutes files
3. Update meeting information and content
4. Add entry to minutes index table in `meeting-minutes/index.html`

### Adding Gallery Images
1. Place images in appropriate `assets/img/gallery/` subfolder
2. Update gallery items in `gallery.html`
3. Ensure images are optimized for web (max 1200px width)

### Updating Sponsor Information
Edit sponsor details in `sponsors.html`:
- Update partner information
- Add new sponsors to recognition sections
- Modify support opportunities as needed

## Content Management

### Meeting Minutes Template
Each meeting minutes page should include:
- Meeting information (date, time, location, attendees)
- Agenda items
- Key discussions
- Decisions made
- Action items with owners and due dates
- Next meeting details

### Documentation Standards
All documentation pages should follow:
- Executive summary
- Detailed sections with clear headings
- Action items and responsibilities
- Success metrics and KPIs
- Navigation links to related documents

### Image Guidelines
- Use descriptive file names
- Include alt text for accessibility
- Optimize for web (compress images)
- Maintain consistent aspect ratios within albums

## Browser Compatibility

This website is tested and compatible with:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Android Chrome)

## Performance Considerations

- Images use lazy loading and placeholder fallbacks
- CSS is optimized for performance with efficient selectors
- JavaScript uses modern best practices with event delegation
- Print styles are optimized for documentation printing

## Accessibility Features

- Semantic HTML5 structure
- ARIA labels for navigation elements
- Skip links for keyboard navigation
- High contrast color scheme
- Focus indicators for interactive elements

## Troubleshooting

### Common Issues

**Images not displaying:**
- Check file paths in HTML
- Ensure images are in correct folders
- Verify file names match exactly (case-sensitive)

**Navigation not working:**
- Check relative paths in navigation links
- Ensure all HTML files exist
- Verify file extensions (.html)

**Mobile menu not working:**
- Check JavaScript is loading properly
- Verify hamburger menu CSS classes
- Test with browser developer tools

**Styles not applying:**
- Check CSS file path in HTML head section
- Verify CSS syntax is valid
- Clear browser cache

### Getting Help

For technical support:
1. Check browser developer console for errors
2. Verify all file paths and names
3. Ensure local server is running properly
4. Test with different browsers if needed

## License

This project is open source and available under the MIT License.

## Contributing

When making changes:
1. Test on multiple screen sizes
2. Verify all links work correctly
3. Check browser compatibility
4. Update documentation as needed
5. Test print functionality for documentation pages

---

**Project Contact:** Dream Builders Team  
**Partner Organization:** Sleep in Heavenly Peace – New River Valley (SHP–NRV)  
**Sponsor Contact:** Paul Mele  
**Project Timeline:** February - May 2026  
**Key Dates:** April 10 (Observation Build), April 25 (Main Build)

<!-- Vercel preview trigger: 2026-02-17T18:27:22Z -->
