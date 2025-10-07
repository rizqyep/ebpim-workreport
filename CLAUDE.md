# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SalesFlow Project Tracker is a React-based dashboard for tracking sprint progress with burndown charts, daily velocity metrics, progress indicators, and story point status visualization. Built with Vite, TypeScript, and shadcn/ui components.

## Development Commands

### Essential Commands
- `bun run dev` - Start development server (Vite)
- `bun run build` - Build for production
- `bun run build:dev` - Build in development mode
- `bun run lint` - Run ESLint
- `bun run preview` - Preview production build

### Build System
- Uses **Bun** as package manager and runtime (not npm)
- Vite with React SWC plugin for fast builds
- TypeScript with relaxed config (no strict null checks, unused variables allowed)
- Path alias: `@/` maps to `./src/`

## Architecture

### Core Data Flow
1. **Configuration** (`src/config.ts`) - Central constants for:
   - Phase dates and story points totals
   - Story points breakdown by status (`STORY_POINTS_BY_STATUS`)
2. **Metrics Utilities** (`src/lib/metrics.ts`) - Pure functions for:
   - Date parsing and label generation
   - Progress calculations (expected vs actual)
   - Velocity calculations (actual and expected daily rates)
   - Burndown data transformation (with null support for future dates)
3. **Actual Data** (`src/data/burndown.ts`) - Daily burndown data array (supports `null` for future dates)
4. **Page Rendering** (`src/pages/Index.tsx`) - Computes metrics on mount and renders charts

### Key Design Patterns
- **Data transformation pipeline**: Raw config → metrics utils → chart data → visualization
- **Single source of truth**: All metrics computed from `config.ts` constants
- **Recharts integration**: Uses ResponsiveContainer + LineChart/BarChart with custom theming via CSS variables

### Component Structure
- `src/components/ui/` - shadcn/ui components (accordion, button, card, chart, etc.)
- `src/components/MetricCard.tsx` - Reusable metric display with optional badges
- `src/components/ChartCard.tsx` - Chart wrapper with title/subtitle
- `src/pages/Index.tsx` - Main dashboard page
- `src/App.tsx` - App shell with React Query, routing, toasts

### Styling System
- Tailwind CSS with custom theme extending shadcn/ui
- CSS variables in `index.css` for:
  - Chart colors (`--chart-1`, `--chart-grid`, `--chart-line-ideal`)
  - Status colors (`--status-todo`, `--status-in-progress`, `--status-need-review`, `--status-in-review`, `--status-done`)
- Custom color palette: `warning`, `success`, `chart.*`, `status.*` for domain-specific theming
- Responsive design: mobile-first grid layouts

### Date & Time Handling
- Uses `date-fns` for all date operations
- Phase dates in `MMM d yyyy` format (e.g., "Sep 15 2025")
- Burndown data in `M/d/yyyy` format (e.g., "9/15/2025")
- Chart labels in `M/d` format (e.g., "9/15")

## Important Implementation Notes

### Updating Project Metrics
To update sprint progress:
1. Edit `src/config.ts`:
   - Update `TOTAL_STORY_COMPLETED` value (completed story points)
   - Update `STORY_POINTS_BY_STATUS` array (breakdown by workflow status)
2. Edit `src/data/burndown.ts`:
   - Update `ACTUAL_BURNDOWN` array with daily remaining story points
   - Use `null` for `storyPoints` to represent future dates (stops the actual line at last known data)
   - Use numeric values for past/current dates
3. Velocity is auto-calculated from completed points and elapsed time (no manual updates needed)

### Adding New Charts
- Use Recharts components with responsive container
- Apply theme colors via `hsl(var(--chart-*))` references
- Follow existing pattern: data transformation in utils → rendering in page component

### Charts Overview
**Burndown Chart**: Shows remaining story points over time with ideal vs actual lines. Actual line stops at last known data (null values = future dates).

**Velocity Chart**: Displays daily velocity comparison - Actual (completed points ÷ days passed) vs Expected (total points ÷ total days). Two bars only, auto-calculated.

**Story Points by Status**: Horizontal stacked bar showing distribution across workflow states (To Do, In Progress, Need Review, In Review, Done). Colors defined in CSS variables. Full width with rounded ends.

### TypeScript Configuration
- Strict mode is disabled (`noImplicitAny: false`, `strictNullChecks: false`)
- Prefer explicit type annotations for clarity despite relaxed config
- Use `satisfies` for config objects when possible

### Routing
- Uses React Router v6
- Main page: `/` → `Index.tsx`
- 404 fallback: `*` → `NotFound.tsx`
- Add new routes above the catch-all `*` route in `App.tsx`

### Commit Rule
- **Do not** include Claude co-authorship in the commit message