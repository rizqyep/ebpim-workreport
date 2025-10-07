import { addDays, differenceInDays, format, isAfter, parse } from "date-fns";

export type ActualPoint = { date: string; storyPoints: number | null };
export type BurndownPoint = { date: string; actual: number | null; ideal: number };

export function parsePhaseDates(startStr: string, endStr: string) {
  const start = parse(startStr, "MMM d yyyy", new Date());
  const end = parse(endStr, "MMM d yyyy", new Date());
  const totalDays = Math.max(differenceInDays(end, start), 1);
  const totalMs = Math.max(end.getTime() - start.getTime(), 1);
  const baseYear = start.getFullYear();
  return { start, end, totalDays, totalMs, baseYear } as const;
}

export function generateDailyLabels(start: Date, end: Date): string[] {
  const totalDays = Math.max(differenceInDays(end, start), 0);
  return Array.from({ length: totalDays + 1 }, (_, i) => format(addDays(start, i), "M/d"));
}

export function computeExpectedProgress(start: Date, end: Date, now: Date = new Date()) {
  const clamped = now < start ? start : now > end ? end : now;
  const totalMs = Math.max(end.getTime() - start.getTime(), 1);
  const ratio = Math.min(Math.max((clamped.getTime() - start.getTime()) / totalMs, 0), 1);
  return ratio; // 0..1
}

export function computeActualProgress(totalPoints: number, totalCompleted: number) {
  const completed = Math.min(Math.max(totalCompleted, 0), Math.max(totalPoints, 0));
  return totalPoints > 0 ? completed / totalPoints : 0;
}

export function computeGapPercent(actualRatio: number, expectedRatio: number) {
  return (actualRatio - expectedRatio) * 100; // signed percent
}

export function buildBurndownData(
  labels: string[],
  phaseStart: Date,
  phaseEnd: Date,
  totalPoints: number,
  actual: ActualPoint[]
): BurndownPoint[] {
  const { totalDays } = parsePhaseDates(format(phaseStart, "MMM d yyyy"), format(phaseEnd, "MMM d yyyy"));
  const map = new Map(actual.map((p) => [p.date, p.storyPoints] as const));
  let lastActual = totalPoints;

  return labels.map((label) => {
    const pointDate = parse(`${label} ${phaseStart.getFullYear()}`, "M/d yyyy", phaseStart);
    const elapsed = Math.min(Math.max(differenceInDays(pointDate, phaseStart), 0), totalDays);
    const idealRaw = totalPoints * (1 - elapsed / totalDays);
    const ideal = Math.max(Math.round(idealRaw * 100) / 100, 0);

    const key = format(pointDate, "M/d/yyyy");
    const observed = map.get(key);

    // If explicitly null, this is a future date - don't show actual value
    if (observed === null) {
      return { date: label, actual: null, ideal };
    }

    // If we have actual data, update the last known value
    if (observed !== undefined) {
      lastActual = observed;
    }

    return { date: label, actual: lastActual, ideal };
  });
}

export function buildWeekRanges(phaseStart: Date, phaseEnd: Date, weeks: number) {
  return Array.from({ length: weeks }, (_, i) => {
    const start = addDays(phaseStart, i * 7);
    let end = addDays(start, 6);
    if (isAfter(end, phaseEnd)) end = phaseEnd;
    return `${format(start, "MMM d")} – ${format(end, "MMM d")}`;
  });
}

export function computeActualVelocity(completedPoints: number, startDate: Date, currentDate: Date = new Date()) {
  const daysPassed = Math.max(differenceInDays(currentDate, startDate), 1);
  return completedPoints / daysPassed;
}

export function computeExpectedVelocity(totalPoints: number, startDate: Date, endDate: Date) {
  const totalDays = Math.max(differenceInDays(endDate, startDate), 1);
  return totalPoints / totalDays;
}

