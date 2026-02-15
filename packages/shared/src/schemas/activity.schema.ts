import { z } from 'zod';

/**
 * Activity category enum
 */
export const activityCategorySchema = z.enum([
  'cardio',
  'strength',
  'flexibility',
]);

/**
 * Activity entity schema
 * Represents a predefined exercise/activity type
 */
export const activitySchema = z.object({
  id: z.string().min(1, 'Activity ID is required'),
  name: z.string().min(1, 'Activity name is required'),
  category: activityCategorySchema,
  avgCaloriesPerMin: z.number().min(0, 'Calories per minute must be positive'),
  description: z.string().max(200).optional(),
  icon: z.string().optional(),
});

/**
 * Schema for creating a new activity (admin only)
 */
export const createActivitySchema = activitySchema.omit({ id: true });

/**
 * Schema for updating an activity (admin only)
 */
export const updateActivitySchema = createActivitySchema.partial();

// Type exports
export type ActivityCategory = z.infer<typeof activityCategorySchema>;
export type Activity = z.infer<typeof activitySchema>;
export type CreateActivity = z.infer<typeof createActivitySchema>;
export type UpdateActivity = z.infer<typeof updateActivitySchema>;
