export * from './activities';
export * from './errors';

/**
 * Application-wide constants
 */

// Date and time formats
export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DD',
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY hh:mm A',
  TIME_ONLY: 'hh:mm A',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// Workout limits
export const WORKOUT_LIMITS = {
  MAX_DURATION_MINUTES: 1440, // 24 hours
  MIN_DURATION_MINUTES: 1,
  MAX_NOTES_LENGTH: 500,
} as const;

// User limits
export const USER_LIMITS = {
  MAX_DISPLAY_NAME_LENGTH: 100,
  MIN_PASSWORD_LENGTH: 6,
  MAX_WEEKLY_GOAL: 7,
} as const;

// Cache keys
export const CACHE_KEYS = {
  ACTIVITIES: 'activities',
  USER_PROFILE: 'user_profile',
  WORKOUTS: 'workouts',
  DASHBOARD_STATS: 'dashboard_stats',
} as const;

// Query stale times (in milliseconds)
export const STALE_TIMES = {
  ACTIVITIES: 1000 * 60 * 60 * 24, // 24 hours (rarely changes)
  USER_PROFILE: 1000 * 60 * 5, // 5 minutes
  WORKOUTS: 1000 * 60, // 1 minute
  DASHBOARD_STATS: 1000 * 60 * 5, // 5 minutes
} as const;
