import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty({ type: [CreateOrderItemDto], description: 'Order line items' })
  @IsArray({ message: 'Items must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];

  @ApiPropertyOptional({
    description: 'Shipping address identifier',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  shippingAddressId?: string;

  @ApiPropertyOptional({
    description: 'Billing address identifier',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  billingAddressId?: string;

  @ApiPropertyOptional({ description: 'Preferred shipping method' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  shippingMethod?: string;

  @ApiPropertyOptional({ description: 'Customer contact phone' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9\-()\s]+$/, {
    message: 'Phone number must contain only digits and phone characters',
  })
  phone?: string;

  @ApiPropertyOptional({ description: 'Additional notes for the order' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiPropertyOptional({ description: 'Order metadata', type: Object })
  @IsOptional()
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Currency code', default: 'USD' })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{3}$/)
  currency?: string;

  @ApiPropertyOptional({ description: 'Shipping charge applied to the order' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  shippingAmount?: number;

  @ApiPropertyOptional({ description: 'Tax amount applied to the order' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number;

  @ApiPropertyOptional({ description: 'Discount amount applied to the order' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;
}
