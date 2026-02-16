import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/Card';
import { Calendar } from 'lucide-react';
import type { BestDay } from '@repo/shared';

interface BestDayCardProps {
  bestDay: BestDay | null;
}

export function BestDayCard({ bestDay }: BestDayCardProps) {
  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          <CardTitle className="text-gray-900">Best Day</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {bestDay ? (
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{bestDay.dayName}</p>
            <p className="text-sm text-gray-600 mt-1">
              {bestDay.totalWorkouts} {bestDay.totalWorkouts === 1 ? 'workout' : 'workouts'}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center">
            Log workouts to see your best day
          </p>
        )}
      </CardContent>
    </Card>
  );
}
