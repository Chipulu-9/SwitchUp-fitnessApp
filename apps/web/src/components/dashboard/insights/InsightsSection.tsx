import { useMemo } from 'react';
import type { Workout } from '@repo/shared';
import {
  calculateWeeklyTrends,
  calculateWeekOverWeek,
  calculateConsistencyScore,
  calculateBestDay,
  calculateAverageMetrics,
  calculatePersonalBests,
} from '@repo/shared';
import { WeeklyTrendChart } from './WeeklyTrendChart';
import { WeekOverWeekCard } from './WeekOverWeekCard';
import { ConsistencyScoreCard } from './ConsistencyScoreCard';
import { BestDayCard } from './BestDayCard';
import { AverageMetricsCard } from './AverageMetricsCard';
import { PersonalBestsCard } from './PersonalBestsCard';

interface InsightsSectionProps {
  workouts: Workout[];
  weeklyGoal: number;
}

export function InsightsSection({ workouts, weeklyGoal }: InsightsSectionProps) {
  const trends = useMemo(() => calculateWeeklyTrends(workouts), [workouts]);
  const comparison = useMemo(() => calculateWeekOverWeek(workouts), [workouts]);
  const consistency = useMemo(
    () => calculateConsistencyScore(workouts, weeklyGoal),
    [workouts, weeklyGoal]
  );
  const bestDay = useMemo(() => calculateBestDay(workouts), [workouts]);
  const averages = useMemo(() => calculateAverageMetrics(workouts), [workouts]);
  const personalBests = useMemo(() => calculatePersonalBests(workouts), [workouts]);

  return (
    <div className="space-y-6" data-testid="insights-section">
      <h2 className="text-xl font-bold text-gray-900">Performance Insights</h2>

      <WeeklyTrendChart trends={trends} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WeekOverWeekCard comparison={comparison} />
        <ConsistencyScoreCard score={consistency} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BestDayCard bestDay={bestDay} />
        <AverageMetricsCard metrics={averages} />
        <PersonalBestsCard bests={personalBests} />
      </div>
    </div>
  );
}
