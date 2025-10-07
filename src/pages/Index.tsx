import { MetricCard } from "@/components/MetricCard";
import { ChartCard } from "@/components/ChartCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  PHASE_END_DATE,
  PHASE_START_DATE,
  STORY_POINTS_BY_STATUS,
  TOTAL_STORY_COMPLETED,
  TOTAL_STORY_POINT,
} from "@/config";
import { ACTUAL_BURNDOWN } from "@/data/burndown";
import {
  buildBurndownData,
  computeActualProgress,
  computeActualVelocity,
  computeExpectedProgress,
  computeExpectedVelocity,
  computeGapPercent,
  generateDailyLabels,
  parsePhaseDates,
} from "@/lib/metrics";

const { start: phaseStart, end: phaseEnd } = parsePhaseDates(
  PHASE_START_DATE,
  PHASE_END_DATE
);
const BURNDOWN_DATES = generateDailyLabels(phaseStart, phaseEnd);

const expectedRatio = computeExpectedProgress(phaseStart, phaseEnd);
const EXPECTED_PROGRESS_DISPLAY = `${(expectedRatio * 100).toFixed(1)}%`;

const actualRatio = computeActualProgress(
  TOTAL_STORY_POINT,
  TOTAL_STORY_COMPLETED
);
const ACTUAL_PROGRESS_DISPLAY = `${(actualRatio * 100).toFixed(1)}%`;
const ACTUAL_PROGRESS_DESC = `${TOTAL_STORY_COMPLETED} / ${TOTAL_STORY_POINT} pts`;

const gapPercent = computeGapPercent(actualRatio, expectedRatio);
const GAP_DISPLAY = `${gapPercent >= 0 ? "+" : ""}${gapPercent.toFixed(1)}%`;
const GAP_BADGE =
  gapPercent < 0
    ? { text: "At Risk", variant: "warning" as const }
    : { text: "On Track", variant: "success" as const };

const burndownData = buildBurndownData(
  BURNDOWN_DATES,
  phaseStart,
  phaseEnd,
  TOTAL_STORY_POINT,
  ACTUAL_BURNDOWN
);

const actualVelocity = computeActualVelocity(TOTAL_STORY_COMPLETED, phaseStart);
const expectedVelocity = computeExpectedVelocity(
  TOTAL_STORY_POINT,
  phaseStart,
  phaseEnd
);

const velocityData = [
  { type: "Actual", velocity: actualVelocity },
  { type: "Expected", velocity: expectedVelocity },
];

// Transform status data for stacked bar chart
const statusData = STORY_POINTS_BY_STATUS.reduce((acc, item) => {
  acc[item.status] = item.points;
  return acc;
}, {} as Record<string, number>);

const statusColors = {
  "To Do": "hsl(var(--status-todo))",
  "In Progress": "hsl(var(--status-in-progress))",
  "Need Review": "hsl(var(--status-need-review))",
  "In Review": "hsl(var(--status-in-review))",
  Done: "hsl(var(--status-done))",
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                EB - PIM - Sprint 2 Tracking
              </h1>
              <p className="text-sm text-muted-foreground">
                {PHASE_START_DATE} → {PHASE_END_DATE}
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm text-muted-foreground mb-1">
                Total Story Points
              </p>
              <p className="text-4xl md:text-5xl font-bold text-primary">
                {TOTAL_STORY_POINT}
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <MetricCard
            title="Actual Progress"
            value={ACTUAL_PROGRESS_DISPLAY}
            description={ACTUAL_PROGRESS_DESC}
          />
          <MetricCard
            title="Expected Progress"
            value={EXPECTED_PROGRESS_DISPLAY}
            description="Time-based"
          />
          <MetricCard title="Gap" value={GAP_DISPLAY} badge={GAP_BADGE} />
        </div>

        {/* Burndown Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <ChartCard title="Burndown Chart" subtitle="Remaining Story Points">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={burndownData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--chart-grid))"
                />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ideal"
                  stroke="hsl(var(--chart-line-ideal))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Ideal"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  name="Actual"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Velocity Chart */}
          <ChartCard
            title="Velocity Chart"
            subtitle="Cumulative Average Velocity"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={velocityData}
                margin={{ top: 25, right: 25, left: 25, bottom: 5 }}
              >
                <XAxis
                  dataKey="type"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value: number) => value.toFixed(2)}
                  labelFormatter={(label) => `${label} Velocity`}
                />
                <Bar
                  dataKey="velocity"
                  radius={[8, 8, 0, 0]}
                  name="Velocity"
                  label={{
                    position: "top",
                    formatter: (value: number) => value.toFixed(2),
                  }}
                >
                  {velocityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.type === "Actual"
                          ? "hsl(var(--chart-1))"
                          : "hsl(var(--muted-foreground) / 0.5)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Story Points by Status */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Story Points by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={80}>
                <BarChart
                  data={[statusData]}
                  layout="vertical"
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  barSize={40}
                >
                  <XAxis type="number" hide domain={[0, TOTAL_STORY_POINT]} />
                  <YAxis type="category" hide />
                  {STORY_POINTS_BY_STATUS.map((item, index) => (
                    <Bar
                      key={item.status}
                      dataKey={item.status}
                      stackId="status"
                      fill={
                        statusColors[item.status as keyof typeof statusColors]
                      }
                      radius={
                        index === 0
                          ? [8, 0, 0, 8] // First item: round left corners
                          : index === STORY_POINTS_BY_STATUS.length - 1
                          ? [0, 8, 8, 0] // Last item: round right corners
                          : [0, 0, 0, 0] // Middle items: no rounding
                      }
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
              {/* Custom Legend */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {STORY_POINTS_BY_STATUS.map((item) => (
                  <div key={item.status} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm flex-shrink-0"
                      style={{
                        backgroundColor:
                          statusColors[item.status as keyof typeof statusColors],
                      }}
                    />
                    <span className="text-xs text-muted-foreground truncate">
                      {item.status} - {item.points}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
