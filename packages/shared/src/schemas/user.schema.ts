import { z } from 'zod';

/**
 * User role enum
 */
export const userRoleSchema = z.enum(['user', 'admin']);

/**
 * User preferences schema
 */
export const userPreferencesSchema = z.object({
  weeklyGoal: z.number().min(0).max(7).optional(),
  defaultView: z.enum(['dashboard', 'workouts', 'history']).optional(),
  calorieGoal: z.number().min(0).optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
});

/**
 * User entity schema
 */
export const userSchema = z.object({
  uid: z.string().min(1, 'User ID is required'),
  email: z.string().email('Invalid email address'),
  displayName: z.string().min(1).max(100).optional(),
  photoURL: z.string().url().optional(),
  role: userRoleSchema.default('user'),
  preferences: userPreferencesSchema.optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

/**
 * Schema for updating user profile
 */
export const updateUserSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  photoURL: z.string().url().optional(),
  preferences: userPreferencesSchema.optional(),
});

// Type exports
export type UserRole = z.infer<typeof userRoleSchema>;
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type User = z.infer<typeof userSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
