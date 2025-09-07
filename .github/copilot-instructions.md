# Skills Introduction to GitHub - Developer Guide

This repository contains a GitHub Skills tutorial course combined with two website builder applications: a React-based single-page application and a standalone HTML/JavaScript website builder with drag-and-drop functionality.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Environment Setup
- Node.js v20.19.4 and npm v10.8.2 are pre-installed and available
- No additional SDK installations required

### Bootstrap and Build
- Install dependencies: `npm install`
  - Takes 1 minute 40 seconds. NEVER CANCEL. Set timeout to 300+ seconds.
  - Produces warnings but no errors - this is expected behavior
- Build the React application: `npm run build`
  - Takes 6 seconds. Very fast build process.
  - Creates optimized production build in `build/` directory
- Test suite: `npm test -- --watchAll=false --passWithNoTests`
  - Takes less than 1 second. No tests exist but command succeeds with --passWithNoTests flag.

### Running the Applications

#### React Application (Primary)
- Development server: `npm start`
  - Starts server on http://localhost:3000
  - Auto-reloads on code changes
  - Use this for React component development
- Production build: Serve the `build/` directory with any static server

#### Standalone HTML Application (Secondary)  
- Use any HTTP server to serve the root directory
- Example: `python3 -m http.server 8000`
- Access at http://localhost:8000
- Serves the standalone website builder (index.html, app.js, styles.css)

### Linting and Code Quality
- ESLint is configured in package.json but no `npm run lint` script exists
- Run manual linting: `npx eslint src/ --ext .js,.jsx` (if needed)
- No formatting tools configured

## Project Structure

### Key Components
```
/
├── src/                 # React application source
│   ├── App.js          # Main React app with navigation
│   ├── Dashboard.js    # Dashboard component
│   ├── Editor.js       # Website editor component  
│   ├── AITools.js      # AI tools component
│   └── index.js        # React entry point
├── index.html          # Standalone website builder app
├── app.js              # Standalone app JavaScript (18KB)
├── styles.css          # Standalone app styles (10KB)
├── package.json        # React dependencies and scripts
├── .github/workflows/  # GitHub Skills course workflows
└── .github/steps/      # GitHub Skills course step definitions
```

### Dual Application Nature
1. **React SPA**: Simple 3-screen website builder interface (Dashboard → Editor → AI Tools)
2. **Standalone HTML App**: Feature-rich website builder with drag-and-drop, element panels, code editor
3. **GitHub Skills Course**: Tutorial workflows that guide users through GitHub basics

## Validation

### Manual Testing Requirements
Always manually validate changes by running complete user scenarios:

#### React Application Scenarios
1. Start development server: `npm start`
2. Navigate to http://localhost:3000
3. Click through all navigation: Dashboard → Editor → AI Tools → Dashboard
4. Verify all screens load and navigation works properly
5. Check browser console for errors

#### Standalone Application Scenarios  
1. Start HTTP server: `python3 -m http.server 8000`
2. Navigate to http://localhost:8000
3. Test navigation: Dashboard → Website Editor → AI Tools & SEO
4. Verify drag-and-drop elements panel functions
5. Test editor controls (undo/redo, device preview, properties panel)
6. Verify project cards and quick access tools are interactive

### Build Validation
- Always run `npm run build` after making changes to React components
- Verify build succeeds without errors
- Build artifacts are automatically git-ignored

### Common Validation Workflow
1. Make changes to React components in `src/`
2. Test in development: `npm start` and validate manually
3. Build for production: `npm run build`  
4. Test standalone app: `python3 -m http.server 8000`
5. Verify both applications function correctly

## GitHub Skills Course Context

### Course Workflows
- `.github/workflows/` contains 5 workflow files that drive the tutorial experience
- Workflows trigger on branch creation, commits, and pull requests  
- Each workflow updates course progress and README content
- Do not modify workflow files unless specifically needed for the issue

### Step Management
- Course progress tracked in `.github/steps/-step.txt`
- Step content in `.github/steps/*.md` files
- Workflows automatically update step progression

## Common Tasks

### Development Workflow
1. Install dependencies: `npm install` (1m 40s, NEVER CANCEL)
2. Start React dev server: `npm start`
3. Make changes to components in `src/`
4. Validate changes in browser at localhost:3000
5. Build production: `npm run build` (6s)
6. Test standalone app separately if needed

### Troubleshooting
- If npm install fails, check Node.js version: `node --version` (should be v20.19.4)
- If React app won't start, check port 3000 availability
- If standalone app shows file errors, ensure serving from repository root
- Build artifacts in `build/` directory are git-ignored - do not commit them

### Repository File Overview
```
ls -la [repo-root]
.git/                   # Git repository data
.github/               # GitHub Skills course and workflows  
.gitignore             # Excludes node_modules, build/, logs
LICENSE                # MIT license
README.md              # Course instructions and content
app.js                 # Standalone website builder (18KB)
images/                # Course and app images
index.html             # Standalone app entry point (15KB)
package.json           # React app dependencies and scripts
package-lock.json      # Locked dependency versions (auto-generated)
public/                # React app public assets
src/                   # React app source code
styles.css             # Standalone app styles (10KB)
```

### Package.json Scripts
```json
{
  "start": "react-scripts start",     // Dev server on port 3000
  "build": "react-scripts build",     // Production build (6s)
  "test": "react-scripts test",       // Test runner (use --passWithNoTests)
  "eject": "react-scripts eject"      // Irreversible - DO NOT USE
}
```

## Critical Reminders

- **NEVER CANCEL** npm install (1m 40s) or any build commands
- Always test both React app AND standalone HTML app after changes
- Build artifacts are git-ignored - do not commit `build/` directory
- No tests exist but test command works with `--passWithNoTests` flag
- Two separate applications exist - validate both when making changes
- GitHub Skills workflows manage course progression automatically