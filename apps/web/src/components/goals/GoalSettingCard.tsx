import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/Card';
import { Button } from '@repo/ui/Button';
import { Settings, Save, X } from 'lucide-react';

interface GoalSettingCardProps {
  currentWeeklyGoal: number;
  currentCalorieGoal: number;
  onSave: (goals: { weeklyGoal: number; calorieGoal: number }) => Promise<void>;
  isSaving: boolean;
}

export function GoalSettingCard({
  currentWeeklyGoal,
  currentCalorieGoal,
  onSave,
  isSaving,
}: GoalSettingCardProps) {
  const [editing, setEditing] = useState(false);
  const [weeklyGoal, setWeeklyGoal] = useState(currentWeeklyGoal);
  const [calorieGoal, setCalorieGoal] = useState(currentCalorieGoal);

  const handleSave = async () => {
    await onSave({ weeklyGoal, calorieGoal });
    setEditing(false);
  };

  const handleCancel = () => {
    setWeeklyGoal(currentWeeklyGoal);
    setCalorieGoal(currentCalorieGoal);
    setEditing(false);
  };

  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            <CardTitle className="text-gray-900">Your Goals</CardTitle>
          </div>
          {!editing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditing(true)}
              aria-label="Edit goals"
            >
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weekly Workout Goal
              </label>
              <input
                type="number"
                min={1}
                max={7}
                value={weeklyGoal}
                onChange={e => setWeeklyGoal(Math.min(7, Math.max(1, Number(e.target.value))))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Weekly workout goal"
              />
              <p className="text-xs text-gray-500 mt-1">Workouts per week (1-7)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weekly Calorie Goal
              </label>
              <input
                type="number"
                min={0}
                step={100}
                value={calorieGoal}
                onChange={e => setCalorieGoal(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Weekly calorie goal"
              />
              <p className="text-xs text-gray-500 mt-1">Calories per week</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isSaving} size="sm">
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={handleCancel} size="sm" disabled={isSaving}>
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Workouts/Week</p>
              <p className="text-2xl font-bold text-indigo-600">{currentWeeklyGoal}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Calories/Week</p>
              <p className="text-2xl font-bold text-orange-500">
                {currentCalorieGoal > 0 ? currentCalorieGoal.toLocaleString() : 'Not set'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
