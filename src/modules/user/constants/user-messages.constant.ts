export const USER_MESSAGES = {
  NOT_FOUND: 'User not found',
  CONTEXT_REQUIRED: 'User context is required',
  ACCOUNT_INACTIVE: 'User account is inactive',
  NOT_ACTIVE: 'User is not active',
  NOT_VERIFIED: 'User is not verified',
  ID_REQUIRED: 'User id is required',
  DEACTIVATED_SUCCESS: 'User deactivated successfully',
} as const;

export type UserMessages = typeof USER_MESSAGES;
