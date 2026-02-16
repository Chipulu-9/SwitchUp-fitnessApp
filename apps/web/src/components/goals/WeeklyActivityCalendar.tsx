import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/Card';
import { CalendarDays } from 'lucide-react';
import type { WeeklyActivityCalendar as CalendarType } from '@repo/shared';

interface WeeklyActivityCalendarProps {
  calendar: CalendarType;
}

function getActivityColor(workoutCount: number): string {
  if (workoutCount === 0) return 'bg-gray-100 text-gray-400';
  if (workoutCount === 1) return 'bg-green-200 text-green-800';
  return 'bg-green-400 text-green-900';
}

export function WeeklyActivityCalendar({ calendar }: WeeklyActivityCalendarProps) {
  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-teal-600" />
          <CardTitle className="text-gray-900">This Week</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2" data-testid="activity-calendar">
          {calendar.days.map(day => (
            <div
              key={day.date}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${getActivityColor(day.workoutCount)}`}
              title={day.hasWorkout
                ? `${day.workoutCount} workout${day.workoutCount > 1 ? 's' : ''}`
                : 'No workout'}
            >
              <span className="text-xs font-medium">{day.dayName}</span>
              {day.hasWorkout && (
                <span className="text-sm font-bold mt-1">{day.workoutCount}</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
