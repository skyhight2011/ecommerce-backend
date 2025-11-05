export const ORDER_MESSAGES = {
  ITEMS_REQUIRED: 'Order must contain at least one item',
  NOT_FOUND: 'Order not found',
  PRODUCT_UNAVAILABLE: 'Product is unavailable',
  PRODUCT_INSUFFICIENT: 'Insufficient product inventory',
  VARIANT_UNAVAILABLE: 'Product variant is unavailable',
  VARIANT_INSUFFICIENT: 'Insufficient variant inventory',
  ADDRESS_FORBIDDEN: 'Address not found for user',
} as const;

export type OrderMessages = typeof ORDER_MESSAGES;
