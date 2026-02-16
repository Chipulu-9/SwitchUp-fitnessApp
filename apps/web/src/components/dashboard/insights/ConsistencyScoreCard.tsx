import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/Card';
import { Target } from 'lucide-react';
import { ProgressRing } from '../../shared/ProgressRing';
import type { ConsistencyScore } from '@repo/shared';

interface ConsistencyScoreCardProps {
  score: ConsistencyScore;
}

export function ConsistencyScoreCard({ score }: ConsistencyScoreCardProps) {
  const color = score.score >= 75
    ? 'stroke-green-500'
    : score.score >= 50
      ? 'stroke-yellow-500'
      : 'stroke-red-400';

  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-green-600" />
          <CardTitle className="text-gray-900">Consistency</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-3">
          <ProgressRing percentage={score.score} size={100} strokeWidth={8} color={color}>
            <span className="text-xl font-bold text-gray-900">{score.score}%</span>
          </ProgressRing>
          <p className="text-sm text-gray-600 text-center">
            {score.actualDaysThisWeek} of {score.targetDaysPerWeek} target days
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
