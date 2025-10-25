# AI Agent Instructions for XpemMercurioClient

## Project Overview
This is an Angular 20.3 application with Server-Side Rendering (SSR) support. The project uses Angular Material for UI components and follows modern Angular patterns.

## Architecture & Structure
- **SSR Architecture**: Uses Angular Universal for server-side rendering
  - Entry points: `src/main.ts` (browser), `src/main.server.ts` (server)
  - Server setup: `src/server.ts`
- **Key Directories**:
  - `src/app/pages/` - Page components
  - `public/` - Static assets
  - `src/environments/` - Environment configuration

## Development Workflow
### Local Development
```bash
npm install        # First time setup
npm start         # Starts dev server at http://localhost:4200
npm run watch     # Build with watch mode
npm test         # Run unit tests
```

### Project Conventions
1. **Code Formatting**
   - Uses Prettier with custom config in `package.json`
   - 100 character line width
   - Single quotes for strings
   - Custom Angular HTML parser

2. **Performance Budgets** (configured in `angular.json`)
   - Initial bundle: Warning at 500kB, Error at 1MB
   - Component styles: Warning at 4kB, Error at 8kB

3. **Styling**
   - Uses Angular Material with custom theme (`src/custom-theme.scss`)
   - Global styles in `src/styles.css`

### Common Tasks
- **Generate Components**: `ng generate component pages/[name]`
- **Production Build**: `npm run build`
- **SSR Preview**: `npm run serve:ssr:XpemMercurioClient`

## Dependencies
- Angular Material (@angular/material) - UI component library
- Express - Server for SSR
- RxJS - Reactive programming library

## Testing
- Unit tests use Jasmine/Karma
- Test files follow `.spec.ts` naming convention

## Architecture Notes
- The application is set up for server-side rendering using Angular Universal
- Angular Material provides the design system and component library
- Public assets should be placed in the `public/` directory