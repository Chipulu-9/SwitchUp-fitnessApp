import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/Card';
import { Activity } from 'lucide-react';
import { ProgressRing } from '../shared/ProgressRing';
import type { GoalProgress } from '@repo/shared';

interface WorkoutGoalProgressProps {
  progress: GoalProgress;
}

export function WorkoutGoalProgress({ progress }: WorkoutGoalProgressProps) {
  const color = progress.isComplete
    ? 'stroke-green-500'
    : progress.percentage >= 50
      ? 'stroke-blue-500'
      : 'stroke-blue-400';

  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-gray-900">Workout Goal</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-3">
          <ProgressRing percentage={progress.percentage} size={100} strokeWidth={8} color={color}>
            <span className="text-xl font-bold text-gray-900">{progress.percentage}%</span>
          </ProgressRing>
          <p className="text-sm text-gray-700 font-medium">
            {progress.current} of {progress.target} workouts
          </p>
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                progress.isComplete ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progress.percentage}%` }}
              data-testid="workout-progress-bar"
            />
          </div>
          {progress.isComplete ? (
            <p className="text-sm text-green-600 font-medium">Goal completed!</p>
          ) : (
            <p className="text-xs text-gray-500">
              {progress.remaining} more to go
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
