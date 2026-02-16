import { z } from 'zod';

export const weeklyTrendItemSchema = z.object({
  week: z.string(),
  weekStartDate: z.string(),
  workouts: z.number().min(0),
  duration: z.number().min(0),
  calories: z.number().min(0),
});

export const weekOverWeekComparisonSchema = z.object({
  thisWeek: weeklyTrendItemSchema,
  lastWeek: weeklyTrendItemSchema,
  workoutsDelta: z.number(),
  durationDelta: z.number(),
  caloriesDelta: z.number(),
  workoutsPercentChange: z.number().nullable(),
  durationPercentChange: z.number().nullable(),
  caloriesPercentChange: z.number().nullable(),
});

export const consistencyScoreSchema = z.object({
  targetDaysPerWeek: z.number().min(0).max(7),
  actualDaysThisWeek: z.number().min(0).max(7),
  score: z.number().min(0).max(100),
});

export const bestDaySchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  dayName: z.string(),
  totalWorkouts: z.number().min(0),
});

export const averageMetricsSchema = z.object({
  avgDuration: z.number().min(0),
  avgCalories: z.number().min(0),
  totalSessions: z.number().min(0),
});

export const personalBestsSchema = z.object({
  longestWorkoutDuration: z.number().min(0),
  mostCaloriesInSession: z.number().min(0),
  longestStreak: z.number().min(0),
});

export type WeeklyTrendItem = z.infer<typeof weeklyTrendItemSchema>;
export type WeekOverWeekComparison = z.infer<typeof weekOverWeekComparisonSchema>;
export type ConsistencyScore = z.infer<typeof consistencyScoreSchema>;
export type BestDay = z.infer<typeof bestDaySchema>;
export type AverageMetrics = z.infer<typeof averageMetricsSchema>;
export type PersonalBests = z.infer<typeof personalBestsSchema>;
