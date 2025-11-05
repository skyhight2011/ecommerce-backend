export const COMMON_MESSAGES = {
  USER_ROLE_REQUIRED: 'User role is required',
  PERMISSION_DENIED: 'Insufficient permissions',
  AT_LEAST_ONE_FIELD_REQUIRED: 'At least one field must be provided',
} as const;

export type CommonMessages = typeof COMMON_MESSAGES;
