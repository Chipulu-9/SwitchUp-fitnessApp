import type { Workout } from '@repo/shared';
import { Card, CardContent } from '@repo/ui/Card';
import { Button } from '@repo/ui/Button';
import { formatDuration } from '@repo/shared';

interface WorkoutCardProps {
  workout: Workout;
  onEdit?: (workout: Workout) => void;
  onDelete?: (workout: Workout) => void;
}

/**
 * Workout Card Component
 * Displays a single workout entry with edit/delete actions
 */
export function WorkoutCard({ workout, onEdit, onDelete }: WorkoutCardProps) {
  const workoutDate = new Date(workout.date);
  const formattedDate = workoutDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = workoutDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{workout.activityName}</h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                {workout.activityId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="text-base font-medium text-gray-900">
                  {formatDuration(workout.duration)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Calories Burned</p>
                <p className="text-base font-medium text-gray-900">
                  {workout.caloriesBurned} cal
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>{formattedDate}</p>
              <p>{formattedTime}</p>
            </div>

            {workout.notes && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700 italic">{workout.notes}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {(onEdit || onDelete) && (
            <div className="flex flex-col gap-2 ml-4">
              {onEdit && (
                <Button
                  onClick={() => onEdit(workout)}
                  variant="outline"
                  size="sm"
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  onClick={() => onDelete(workout)}
                  variant="destructive"
                  size="sm"
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
