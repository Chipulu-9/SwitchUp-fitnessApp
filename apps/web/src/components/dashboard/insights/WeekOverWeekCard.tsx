import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatDuration } from '@repo/shared';
import type { WeekOverWeekComparison } from '@repo/shared';

interface WeekOverWeekCardProps {
  comparison: WeekOverWeekComparison;
}

function DeltaIndicator({ delta, percentChange, suffix = '' }: {
  delta: number;
  percentChange: number | null;
  suffix?: string;
}) {
  if (delta > 0) {
    return (
      <div className="flex items-center gap-1 text-green-600">
        <TrendingUp className="w-4 h-4" />
        <span className="text-sm font-medium">
          +{delta}{suffix}
          {percentChange !== null && ` (${percentChange}%)`}
        </span>
      </div>
    );
  }
  if (delta < 0) {
    return (
      <div className="flex items-center gap-1 text-red-600">
        <TrendingDown className="w-4 h-4" />
        <span className="text-sm font-medium">
          {delta}{suffix}
          {percentChange !== null && ` (${percentChange}%)`}
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-gray-500">
      <Minus className="w-4 h-4" />
      <span className="text-sm font-medium">No change</span>
    </div>
  );
}

export function WeekOverWeekCard({ comparison }: WeekOverWeekCardProps) {
  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader>
        <CardTitle className="text-gray-900">This Week vs Last Week</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Workouts</p>
              <p className="text-2xl font-bold text-gray-900">{comparison.thisWeek.workouts}</p>
            </div>
            <DeltaIndicator
              delta={comparison.workoutsDelta}
              percentChange={comparison.workoutsPercentChange}
            />
          </div>
          <div className="border-t border-gray-100" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatDuration(comparison.thisWeek.duration)}
              </p>
            </div>
            <DeltaIndicator
              delta={comparison.durationDelta}
              percentChange={comparison.durationPercentChange}
              suffix="m"
            />
          </div>
          <div className="border-t border-gray-100" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Calories</p>
              <p className="text-2xl font-bold text-gray-900">
                {comparison.thisWeek.calories.toLocaleString()}
              </p>
            </div>
            <DeltaIndicator
              delta={comparison.caloriesDelta}
              percentChange={comparison.caloriesPercentChange}
              suffix=" cal"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
