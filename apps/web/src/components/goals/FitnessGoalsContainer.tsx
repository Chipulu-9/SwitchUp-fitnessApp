import { useState, useMemo } from 'react'
import { GoalSettingCard } from './GoalSettingCard'
import { CalorieGoalProgress } from './CalorieGoalProgress'
import type { GoalProgress } from '@repo/shared' // Assuming you have this type defined

export function FitnessGoalsContainer() {
  // 1. STATE: The Single Source of Truth
  // In a real app, these initial values would come from your database/API
  const [goals, setGoals] = useState({
    weeklyWorkoutGoal: 3,
    weeklyCalorieGoal: 2000,
  })

  // Mock Data: Total calories burned this week (fetch this from your activity logs)
  const currentCaloriesBurned = 1250

  const [isSaving, setIsSaving] = useState(false)

  // 2. CALCULATION: Derived State
  // This automatically recalculates whenever 'goals' or 'currentCaloriesBurned' changes
  const progressData: GoalProgress = useMemo(() => {
    const target = goals.weeklyCalorieGoal
    const current = currentCaloriesBurned

    // Prevent division by zero
    const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0

    return {
      target: target,
      current: current,
      remaining: Math.max(0, target - current),
      percentage: percentage,
      isComplete: current >= target && target > 0,
    }
  }, [goals.weeklyCalorieGoal, currentCaloriesBurned])

  // 3. HANDLER: Updates the state when the user saves changes
  const handleSaveGoals = async (newGoals: { weeklyGoal: number; calorieGoal: number }) => {
    setIsSaving(true)

    // Simulate API delay (replace with your actual DB call)
    await new Promise(resolve => setTimeout(resolve, 800))

    // Update the local state
    setGoals({
      weeklyWorkoutGoal: newGoals.weeklyGoal,
      weeklyCalorieGoal: newGoals.calorieGoal,
    })

    setIsSaving(false)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {/* LEFT: The Input Card */}
      <GoalSettingCard
        currentWeeklyGoal={goals.weeklyWorkoutGoal}
        currentCalorieGoal={goals.weeklyCalorieGoal}
        onSave={handleSaveGoals}
        isSaving={isSaving}
      />

      {/* RIGHT: The Display Card */}
      <CalorieGoalProgress progress={progressData} />
    </div>
  )
}
