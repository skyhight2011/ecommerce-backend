export const PRODUCT_MESSAGES = {
  ID_REQUIRED: 'Product id is required',
  NOT_FOUND: 'Product not found',
  NOT_ACTIVE: 'Product is not active',
  SLUG_REQUIRED: 'Product slug is required',
  CATEGORY_ID_REQUIRED: 'Category id is required',
  STATUS_REQUIRED: 'Status is required',
  STATUS_INVALID: 'Invalid product status',
  QUANTITY_REQUIRED: 'Quantity is required',
  QUANTITY_NEGATIVE: 'Quantity cannot be negative',
} as const;

export type ProductMessages = typeof PRODUCT_MESSAGES;
