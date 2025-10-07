# SalesFlow Project Tracker

A real-time sprint progress dashboard for tracking story points, velocity, and team progress. Built with React, TypeScript, and Recharts.

## Features

### 📊 Three Key Visualizations

1. **Burndown Chart**
   - Tracks remaining story points over time
   - Compares actual progress against ideal burndown line
   - Automatically stops at last known data point (future dates shown as projections only)

2. **Velocity Chart**
   - Shows daily velocity: Actual vs Expected
   - Actual: Completed points ÷ days passed
   - Expected: Total points ÷ total days
   - Auto-calculated from current data

3. **Story Points by Status**
   - Horizontal stacked bar visualization
   - Breakdown by workflow status: To Do → In Progress → Need Review → In Review → Done
   - Color-coded segments with interactive tooltips

### 📈 Progress Metrics

- **Actual Progress**: Current completion percentage
- **Expected Progress**: Time-based projection
- **Gap Analysis**: At Risk or On Track indicators

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) 1.0+

### Installation

```bash
bun install
```

### Development

```bash
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the dashboard.

### Build

```bash
bun run build        # Production build
bun run build:dev    # Development build
bun run preview      # Preview production build
```

### Lint

```bash
bun run lint
```

## Updating Project Data

### 1. Update Completion Status

Edit `src/config.ts`:

```typescript
export const TOTAL_STORY_COMPLETED = 39; // Update completed points

export const STORY_POINTS_BY_STATUS = [
  { status: "To Do", points: 10 },
  { status: "In Progress", points: 19 },
  { status: "Need Review", points: 2 },
  { status: "In Review", points: 6 },
  { status: "Done", points: 39 },
];
```

### 2. Update Daily Burndown

Edit `src/data/burndown.ts`:

```typescript
export const ACTUAL_BURNDOWN: ActualPoint[] = [
  { date: "9/15/2025", storyPoints: 76 },
  { date: "9/16/2025", storyPoints: 74 },
  // ... add daily updates
  { date: "10/2/2025", storyPoints: 39 },  // Last actual data
  { date: "10/3/2025", storyPoints: null }, // Future dates = null
  // ...
];
```

**Important**: Use `null` for future dates to stop the actual line at current progress.

### 3. Velocity Auto-Updates

Velocity calculations update automatically based on:
- `TOTAL_STORY_COMPLETED` / days elapsed = Actual velocity
- `TOTAL_STORY_POINT` / total days = Expected velocity

No manual updates needed!

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Charts**: Recharts
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Date Handling**: date-fns
- **Routing**: React Router v6

## Project Structure

```
src/
├── config.ts              # Project configuration & story points
├── data/
│   └── burndown.ts        # Daily burndown data
├── lib/
│   └── metrics.ts         # Calculation utilities
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── MetricCard.tsx     # Progress metric display
│   └── ChartCard.tsx      # Chart container wrapper
├── pages/
│   └── Index.tsx          # Main dashboard page
└── App.tsx                # App shell with routing
```

## Color Customization

Chart colors are defined as CSS variables in `src/index.css`:

```css
/* Status colors */
--status-todo: 220 15% 70%;           /* Gray */
--status-in-progress: 210 90% 75%;    /* Light Blue */
--status-need-review: 25 90% 55%;     /* Orange */
--status-in-review: 45 93% 58%;       /* Yellow */
--status-done: 142 71% 45%;           /* Green */

/* Chart colors */
--chart-1: 217 91% 60%;               /* Primary blue */
--chart-grid: 220 13% 91%;            /* Grid lines */
--chart-line-ideal: 215 16% 70%;      /* Ideal burndown */
```

## License

This project is private and proprietary.
