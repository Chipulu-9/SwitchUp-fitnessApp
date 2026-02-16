import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/Card';
import { Activity, Clock, Flame } from 'lucide-react';
import { formatDuration } from '@repo/shared';
import type { AverageMetrics } from '@repo/shared';

interface AverageMetricsCardProps {
  metrics: AverageMetrics;
}

export function AverageMetricsCard({ metrics }: AverageMetricsCardProps) {
  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-gray-900">Per Session Averages</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-500 uppercase font-medium">Duration</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {formatDuration(metrics.avgDuration)}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-gray-500 uppercase font-medium">Calories</span>
            </div>
            <p className="text-2xl font-bold text-orange-500">
              {metrics.avgCalories}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center mt-3">
          Based on {metrics.totalSessions} {metrics.totalSessions === 1 ? 'session' : 'sessions'}
        </p>
      </CardContent>
    </Card>
  );
}
