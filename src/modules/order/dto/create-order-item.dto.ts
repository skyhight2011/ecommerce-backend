import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ description: 'Product identifier', format: 'uuid' })
  @IsUUID()
  productId!: string;

  @ApiPropertyOptional({
    description: 'Variant identifier if applicable',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  variantId?: string;

  @ApiProperty({ description: 'Quantity ordered', minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;
}
