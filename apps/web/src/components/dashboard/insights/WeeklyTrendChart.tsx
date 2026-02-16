import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/Card';
import { BarChart3 } from 'lucide-react';
import { formatDuration } from '@repo/shared';
import type { WeeklyTrendItem } from '@repo/shared';

type Metric = 'workouts' | 'duration' | 'calories';

interface WeeklyTrendChartProps {
  trends: WeeklyTrendItem[];
}

const METRIC_LABELS: Record<Metric, string> = {
  workouts: 'Workouts',
  duration: 'Duration',
  calories: 'Calories',
};

function formatValue(value: number, metric: Metric): string {
  if (metric === 'duration') return formatDuration(value);
  if (metric === 'calories') return `${value.toLocaleString()}`;
  return String(value);
}

export function WeeklyTrendChart({ trends }: WeeklyTrendChartProps) {
  const [metric, setMetric] = useState<Metric>('workouts');
  const values = trends.map(t => t[metric]);
  const maxValue = Math.max(...values, 1);

  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-gray-900">Weekly Trends</CardTitle>
          </div>
          <div className="flex gap-1">
            {(Object.keys(METRIC_LABELS) as Metric[]).map(m => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  metric === m
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {METRIC_LABELS[m]}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 h-40" role="img" aria-label="Weekly trend chart">
          {trends.map((trend, i) => {
            const value = trend[metric];
            const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
            const weekLabel = trend.week.split('-W')[1]
              ? `W${trend.week.split('-W')[1]}`
              : trend.week;

            return (
              <div key={trend.week} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-600 font-medium">
                  {formatValue(value, metric)}
                </span>
                <div className="w-full relative" style={{ height: '120px' }}>
                  <div
                    data-testid={`bar-${i}`}
                    className="absolute bottom-0 w-full rounded-t-md bg-gradient-to-t from-indigo-500 to-indigo-400 transition-all duration-300"
                    style={{ height: `${heightPercent}%`, minHeight: value > 0 ? '4px' : '0px' }}
                  />
                </div>
                <span className="text-xs text-gray-500">{weekLabel}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
