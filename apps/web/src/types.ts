// src/types.ts

export interface GoalProgress {
  target: number // The goal (e.g., 2000)
  current: number // Actual burned (e.g., 1250)
  remaining: number // Math.max(0, target - current)
  percentage: number // 0-100
  isComplete: boolean // true if met
}

export interface UserGoals {
  weeklyWorkoutGoal: number
  weeklyCalorieGoal: number
}
