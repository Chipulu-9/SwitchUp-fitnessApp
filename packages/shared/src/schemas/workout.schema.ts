import { z } from 'zod';

/**
 * Workout entity schema
 * Represents a single workout session logged by a user
 */
export const workoutSchema = z.object({
  id: z.string().optional(),
  userId: z.string().min(1, 'User ID is required'),
  activityId: z.string().min(1, 'Activity ID is required'),
  activityName: z.string().min(1, 'Activity name is required'),
  duration: z.number().min(1, 'Duration must be at least 1 minute').max(1440, 'Duration cannot exceed 24 hours'),
  caloriesBurned: z.number().min(0, 'Calories cannot be negative'),
  date: z.string().datetime('Invalid date format'),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

/**
 * Schema for creating a new workout
 * Excludes auto-generated fields (id, userId, timestamps)
 */
export const createWorkoutSchema = workoutSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Schema for updating an existing workout
 * All fields are optional except those that shouldn't change
 */
export const updateWorkoutSchema = createWorkoutSchema.partial();

/**
 * Schema for workout query filters
 */
export const workoutQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  activityId: z.string().optional(),
});

// Type exports
export type Workout = z.infer<typeof workoutSchema>;
export type CreateWorkout = z.infer<typeof createWorkoutSchema>;
export type UpdateWorkout = z.infer<typeof updateWorkoutSchema>;
export type WorkoutQuery = z.infer<typeof workoutQuerySchema>;
