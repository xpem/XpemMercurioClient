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

## Project Conventions
1. **Code Formatting**
   - Uses Prettier with custom config in `package.json`
   - 100 character line width
   - Single quotes for strings

2. **Performance Budgets** (configured in `angular.json`)
   - Initial bundle: Warning at 500kB, Error at 1MB
   - Component styles: Warning at 4kB, Error at 8kB

3. **Styling**
   - Uses Angular Material with custom theme (`src/custom-theme.scss`)
   - Global styles in `src/styles.css`

## Dependencies
- Angular Material (@angular/material) - UI component library
- Express - Server for SSR
- RxJS - Reactive programming library

## Testing
- Unit tests use Jasmine/Karma
- Test files follow `.spec.ts` naming convention

## Angular 20.3 Modern Control Flow Syntax

This project uses **Angular 20.3 (LTS)** with modern control flow blocks introduced in Angular 17+. Always use the new syntax - **NOT** the deprecated `*ngIf`, `*ngFor`, `*ngSwitch` directives.

### ✅ Modern Syntax (Use These)

**@if - Conditional Statements**
```html
@if (condition) {
  <p>Content when true</p>
}
```

**@for - Loops**
```html
@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
}
```
⚠️ O atributo `track` é obrigatório e deve referenciar um identificador único.

**@switch / @case**
```html
@switch (status) {
  @case ('active') { <span>Active</span> }
  @default { <span>Unknown</span> }
}
```

### ❌ Deprecated Syntax (Never Use)
- `*ngIf` → Use `@if`
- `*ngFor` → Use `@for`
- `*ngSwitch` / `*ngCase` → Use `@switch` / `@case`
- NgModules → Use standalone components

### Additional Rules
- **Standalone Components**: Components are standalone by default; no need for NgModule declarations.
- **Function-based Routing**: Routes are defined in `app.routes.ts`.
- **Strict TypeScript**: `strict: true` — all types must be properly typed.
- **RxJS 7.8**: Use Observables for async operations.
