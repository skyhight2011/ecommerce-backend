import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FulfillmentStatus, OrderStatus, PaymentStatus } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { AddressResponseDto } from 'src/modules/user/dto/address-response.dto';

class OrderItemResponseDto {
  @ApiProperty({ description: 'Order item identifier' })
  @Expose()
  id!: string;

  @ApiProperty({ description: 'Product identifier' })
  @Expose()
  productId!: string;

  @ApiPropertyOptional({ description: 'Variant identifier if applicable' })
  @Expose()
  variantId?: string | null;

  @ApiProperty({ description: 'Product name at the time of ordering' })
  @Expose()
  productName!: string;

  @ApiPropertyOptional({ description: 'Variant display name' })
  @Expose()
  variantName?: string | null;

  @ApiPropertyOptional({ description: 'Product SKU' })
  @Expose()
  productSku?: string | null;

  @ApiProperty({
    description: 'Unit price stored as string to preserve precision',
  })
  @Expose()
  price!: string;

  @ApiProperty({ description: 'Quantity purchased' })
  @Expose()
  quantity!: number;

  @ApiProperty({
    description: 'Line total stored as string to preserve precision',
  })
  @Expose()
  total!: string;
}

export class OrderResponseDto {
  @ApiProperty({ description: 'Order identifier' })
  @Expose()
  id!: string;

  @ApiProperty({ description: 'Public facing order number' })
  @Expose()
  orderNumber!: string;

  @ApiProperty({ description: 'Associated customer identifier' })
  @Expose()
  userId!: string;

  @ApiProperty({ enum: OrderStatus })
  @Expose()
  status!: OrderStatus;

  @ApiProperty({ enum: PaymentStatus })
  @Expose()
  paymentStatus!: PaymentStatus;

  @ApiProperty({ enum: FulfillmentStatus })
  @Expose()
  fulfillmentStatus!: FulfillmentStatus;

  @ApiProperty({
    description: 'Subtotal stored as string to preserve precision',
  })
  @Expose()
  subtotal!: string;

  @ApiProperty({
    description: 'Tax amount stored as string to preserve precision',
  })
  @Expose()
  taxAmount!: string;

  @ApiProperty({
    description: 'Shipping amount stored as string to preserve precision',
  })
  @Expose()
  shippingAmount!: string;

  @ApiProperty({
    description: 'Discount amount stored as string to preserve precision',
  })
  @Expose()
  discountAmount!: string;

  @ApiProperty({
    description: 'Total amount stored as string to preserve precision',
  })
  @Expose()
  total!: string;

  @ApiProperty({ description: 'Currency code' })
  @Expose()
  currency!: string;

  @ApiProperty({ description: 'Customer email used for the order' })
  @Expose()
  customerEmail!: string;

  @ApiPropertyOptional({ description: 'Customer phone if available' })
  @Expose()
  customerPhone?: string | null;

  @ApiPropertyOptional({ description: 'Shipping method selected' })
  @Expose()
  shippingMethod?: string | null;

  @ApiPropertyOptional({ description: 'Tracking number if available' })
  @Expose()
  trackingNumber?: string | null;

  @ApiPropertyOptional({ description: 'Estimated delivery timestamp' })
  @Expose()
  estimatedDelivery?: Date | null;

  @ApiPropertyOptional({ description: 'Administrative or customer notes' })
  @Expose()
  notes?: string | null;

  @ApiPropertyOptional({ description: 'Additional metadata object' })
  @Expose()
  metadata?: Record<string, unknown> | null;

  @ApiProperty({ description: 'Created timestamp' })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ description: 'Last updated timestamp' })
  @Expose()
  updatedAt!: Date;

  @ApiPropertyOptional({ description: 'When the order was shipped' })
  @Expose()
  shippedAt?: Date | null;

  @ApiPropertyOptional({ description: 'When the order was delivered' })
  @Expose()
  deliveredAt?: Date | null;

  @ApiPropertyOptional({
    description: 'Order line items',
    type: [OrderItemResponseDto],
  })
  @Expose()
  @Type(() => OrderItemResponseDto)
  items?: OrderItemResponseDto[];

  @ApiPropertyOptional({ description: 'Shipping address details' })
  @Expose()
  @Type(() => AddressResponseDto)
  shippingAddress?: AddressResponseDto | null;

  @ApiPropertyOptional({ description: 'Billing address details' })
  @Expose()
  @Type(() => AddressResponseDto)
  billingAddress?: AddressResponseDto | null;
}
