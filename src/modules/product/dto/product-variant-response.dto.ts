import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProductVariantResponseDto {
  @ApiProperty({
    description: 'Variant unique identifier',
    example: 'clx1234567890abcdef',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Product ID',
    example: 'clx1234567890abcdef',
  })
  @Expose()
  productId: string;

  @ApiProperty({
    description: 'Variant name',
    example: 'Red - Large',
  })
  @Expose()
  name: string;

  @ApiPropertyOptional({
    description: 'Variant SKU',
    example: 'PROD-001-RED-L',
  })
  @Expose()
  sku?: string;

  @ApiPropertyOptional({
    description: 'Variant price',
    example: '29.99',
  })
  @Expose()
  price?: string;

  @ApiProperty({
    description: 'Variant quantity in stock',
    example: 50,
  })
  @Expose()
  quantity: number;

  @ApiProperty({
    description: 'Variant attributes',
    example: { color: 'red', size: 'large' },
  })
  @Expose()
  attributes: Record<string, any>;

  @ApiProperty({
    description: 'Whether variant is active',
    example: true,
  })
  @Expose()
  isActive: boolean;

  @ApiProperty({
    description: 'Variant creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Variant update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  @Expose()
  updatedAt: Date;
}
