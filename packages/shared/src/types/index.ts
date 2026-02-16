/**
 * Shared TypeScript types and interfaces
 */

// Re-export schema types
export type {
  Activity,
  ActivityCategory,
  ActivityBreakdown,
  AverageMetrics,
  BestDay,
  CalendarDay,
  ChangePassword,
  ConsistencyScore,
  CreateActivity,
  CreateWorkout,
  DashboardData,
  DashboardQuery,
  DashboardStats,
  GoalProgress,
  LoginCredentials,
  MotivationalFeedback,
  PersonalBests,
  ResetPassword,
  SignupCredentials,
  UpdateActivity,
  UpdateUser,
  UpdateWorkout,
  User,
  UserPreferences,
  UserRole,
  WeeklyActivityCalendar,
  WeeklyProgress,
  WeeklyTrendItem,
  WeekOverWeekComparison,
  Workout,
  WorkoutQuery,
} from '../schemas';

/**
 * API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort options
 */
export interface SortOptions {
  field: string;
  direction: SortDirection;
}

/**
 * Filter operator
 */
export type FilterOperator = '=' | '!=' | '>' | '>=' | '<' | '<=' | 'in' | 'contains';

/**
 * Filter condition
 */
export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

/**
 * Query options
 */
export interface QueryOptions {
  limit?: number;
  offset?: number;
  sort?: SortOptions;
  filters?: FilterCondition[];
}
