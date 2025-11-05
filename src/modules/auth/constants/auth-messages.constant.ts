export const AUTH_MESSAGES = {
  USER_ALREADY_EXISTS: 'User with this email already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
  ACCOUNT_INACTIVE: 'Account is not active',
  EMAIL_NOT_VERIFIED: 'Please verify your email first',
  USER_NOT_FOUND_OR_INACTIVE: 'User not found or inactive',
  CURRENT_PASSWORD_INCORRECT: 'Current password is incorrect',
  USER_NOT_FOUND_OR_UNAUTHORIZED: 'User not found or unauthorized',
  PASSWORD_UPDATE_SUCCESS: 'Password updated successfully',
  NEW_PASSWORD_DIFFERENT:
    'New password must be different from current password',
} as const;

export type AuthMessages = typeof AUTH_MESSAGES;
