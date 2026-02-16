import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/Card';
import { Flame } from 'lucide-react';
import { ProgressRing } from '../shared/ProgressRing';
import type { GoalProgress } from '@repo/shared';

interface CalorieGoalProgressProps {
  progress: GoalProgress;
}

export function CalorieGoalProgress({ progress }: CalorieGoalProgressProps) {
  const color = progress.isComplete
    ? 'stroke-green-500'
    : progress.percentage >= 50
      ? 'stroke-orange-500'
      : 'stroke-orange-400';

  if (progress.target === 0) {
    return (
      <Card className="border-gray-200 shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-600" />
            <CardTitle className="text-gray-900">Calorie Goal</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-4">
            Set a weekly calorie goal to track your progress
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-600" />
          <CardTitle className="text-gray-900">Calorie Goal</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-3">
          <ProgressRing percentage={progress.percentage} size={100} strokeWidth={8} color={color}>
            <span className="text-xl font-bold text-gray-900">{progress.percentage}%</span>
          </ProgressRing>
          <p className="text-sm text-gray-700 font-medium">
            {progress.current.toLocaleString()} of {progress.target.toLocaleString()} cal
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                progress.isComplete ? 'bg-green-500' : 'bg-orange-500'
              }`}
              style={{ width: `${progress.percentage}%` }}
              data-testid="calorie-progress-bar"
            />
          </div>
          {progress.isComplete ? (
            <p className="text-sm text-green-600 font-medium">Goal completed!</p>
          ) : (
            <p className="text-xs text-gray-500">
              {progress.remaining.toLocaleString()} cal remaining
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
