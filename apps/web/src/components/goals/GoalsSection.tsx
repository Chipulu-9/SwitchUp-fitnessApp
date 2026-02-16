import { useMemo, useState } from 'react'
import type { Workout } from '@repo/shared'
import {
  calculateWorkoutGoalProgress,
  calculateCalorieGoalProgress,
  buildWeeklyActivityCalendar,
  getMotivationalFeedback,
} from '@repo/shared'
import { GoalSettingCard } from './GoalSettingCard'
import { WorkoutGoalProgress } from './WorkoutGoalProgress'
// This is the fixed import: it now looks in the current folder (.) instead of dashboard
import { CalorieGoalProgress } from './CalorieGoalProgress'
import { WeeklyActivityCalendar } from './WeeklyActivityCalendar'
import { MotivationalMessage } from './MotivationalMessage'

interface GoalsSectionProps {
  workouts: Workout[]
  weeklyGoal: number
  calorieGoal: number
  onUpdateGoals: (goals: { weeklyGoal: number; calorieGoal: number }) => Promise<void>
}

export function GoalsSection({
  workouts,
  weeklyGoal,
  calorieGoal,
  onUpdateGoals,
}: GoalsSectionProps) {
  const [isSaving, setIsSaving] = useState(false)

  const workoutProgress = useMemo(
    () => calculateWorkoutGoalProgress(workouts, weeklyGoal),
    [workouts, weeklyGoal]
  )

  const calorieProgress = useMemo(
    () => calculateCalorieGoalProgress(workouts, calorieGoal),
    [workouts, calorieGoal]
  )

  const calendar = useMemo(() => buildWeeklyActivityCalendar(workouts), [workouts])

  const feedback = useMemo(
    () => getMotivationalFeedback(workoutProgress.percentage),
    [workoutProgress.percentage]
  )

  const handleSaveGoals = async (goals: { weeklyGoal: number; calorieGoal: number }) => {
    setIsSaving(true)
    try {
      await onUpdateGoals(goals)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6" data-testid="goals-section">
      <h2 className="text-xl font-bold text-gray-900">Goals & Progress</h2>

      <GoalSettingCard
        currentWeeklyGoal={weeklyGoal}
        currentCalorieGoal={calorieGoal}
        onSave={handleSaveGoals}
        isSaving={isSaving}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WorkoutGoalProgress progress={workoutProgress} />
        <CalorieGoalProgress progress={calorieProgress} />
      </div>

      <WeeklyActivityCalendar calendar={calendar} />

      <MotivationalMessage feedback={feedback} />
    </div>
  )
}
