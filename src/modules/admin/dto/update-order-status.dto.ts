import { ApiPropertyOptional } from '@nestjs/swagger';
import { FulfillmentStatus, OrderStatus, PaymentStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiPropertyOptional({ enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional({ enum: FulfillmentStatus })
  @IsOptional()
  @IsEnum(FulfillmentStatus)
  fulfillmentStatus?: FulfillmentStatus;

  @ApiPropertyOptional({ description: 'Update tracking number for shipment' })
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @ApiPropertyOptional({ description: 'Administrative notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
