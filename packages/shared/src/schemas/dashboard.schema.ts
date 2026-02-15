import { z } from 'zod';

/**
 * Dashboard statistics schema
 */
export const dashboardStatsSchema = z.object({
  totalWorkouts: z.number().min(0),
  totalDuration: z.number().min(0), // in minutes
  totalCalories: z.number().min(0),
  weeklyWorkouts: z.number().min(0),
  weeklyDuration: z.number().min(0),
  weeklyCalories: z.number().min(0),
  currentStreak: z.number().min(0), // days
  longestStreak: z.number().min(0), // days
});

/**
 * Activity breakdown item
 */
export const activityBreakdownSchema = z.object({
  activityId: z.string(),
  activityName: z.string(),
  count: z.number().min(0),
  totalDuration: z.number().min(0),
  totalCalories: z.number().min(0),
  percentage: z.number().min(0).max(100),
});

/**
 * Weekly progress item
 */
export const weeklyProgressSchema = z.object({
  week: z.string(), // ISO week string (e.g., "2024-W01")
  workouts: z.number().min(0),
  duration: z.number().min(0),
  calories: z.number().min(0),
});

/**
 * Dashboard data schema
 */
export const dashboardDataSchema = z.object({
  stats: dashboardStatsSchema,
  activityBreakdown: z.array(activityBreakdownSchema),
  weeklyProgress: z.array(weeklyProgressSchema),
  recentWorkouts: z.array(z.any()), // Will be Workout type
});

/**
 * Query schema for dashboard data
 */
export const dashboardQuerySchema = z.object({
  weeks: z.number().min(1).max(52).default(12),
});

// Type exports
export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
export type ActivityBreakdown = z.infer<typeof activityBreakdownSchema>;
export type WeeklyProgress = z.infer<typeof weeklyProgressSchema>;
export type DashboardData = z.infer<typeof dashboardDataSchema>;
export type DashboardQuery = z.infer<typeof dashboardQuerySchema>;
