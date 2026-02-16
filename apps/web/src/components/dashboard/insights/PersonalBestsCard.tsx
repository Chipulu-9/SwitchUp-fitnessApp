import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/Card';
import { Trophy, Clock, Flame, TrendingUp } from 'lucide-react';
import { formatDuration } from '@repo/shared';
import type { PersonalBests } from '@repo/shared';

interface PersonalBestsCardProps {
  bests: PersonalBests;
}

export function PersonalBestsCard({ bests }: PersonalBestsCardProps) {
  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          <CardTitle className="text-gray-900">Personal Bests</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">
              {formatDuration(bests.longestWorkoutDuration)}
            </p>
            <p className="text-xs text-gray-500">Longest Workout</p>
          </div>
          <div className="text-center">
            <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">
              {bests.mostCaloriesInSession.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Most Calories</p>
          </div>
          <div className="text-center">
            <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">
              {bests.longestStreak}
            </p>
            <p className="text-xs text-gray-500">
              {bests.longestStreak === 1 ? 'Day Streak' : 'Day Streak'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
