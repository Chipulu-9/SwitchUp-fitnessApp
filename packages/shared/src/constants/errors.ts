/**
 * Error codes for the application
 */
export const ERROR_CODES = {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
  AUTH_EMAIL_ALREADY_EXISTS: 'AUTH_EMAIL_ALREADY_EXISTS',
  AUTH_WEAK_PASSWORD: 'AUTH_WEAK_PASSWORD',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // Resource errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',

  // Permission errors
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',

  // Server errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',

  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const;

/**
 * Error messages corresponding to error codes
 */
export const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password',
  [ERROR_CODES.AUTH_USER_NOT_FOUND]: 'User not found',
  [ERROR_CODES.AUTH_EMAIL_ALREADY_EXISTS]: 'An account with this email already exists',
  [ERROR_CODES.AUTH_WEAK_PASSWORD]: 'Password is too weak',
  [ERROR_CODES.AUTH_TOKEN_EXPIRED]: 'Your session has expired. Please log in again',
  [ERROR_CODES.AUTH_UNAUTHORIZED]: 'You must be logged in to perform this action',

  [ERROR_CODES.VALIDATION_ERROR]: 'Invalid data provided',
  [ERROR_CODES.INVALID_INPUT]: 'Invalid input',

  [ERROR_CODES.RESOURCE_NOT_FOUND]: 'Resource not found',
  [ERROR_CODES.RESOURCE_ALREADY_EXISTS]: 'Resource already exists',

  [ERROR_CODES.FORBIDDEN]: 'You do not have permission to perform this action',
  [ERROR_CODES.INSUFFICIENT_PERMISSIONS]: 'Insufficient permissions',

  [ERROR_CODES.INTERNAL_SERVER_ERROR]: 'An unexpected error occurred. Please try again later',
  [ERROR_CODES.DATABASE_ERROR]: 'Database error occurred',
  [ERROR_CODES.EXTERNAL_SERVICE_ERROR]: 'External service error',

  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please try again later',
};

export type ErrorCode = keyof typeof ERROR_CODES;
