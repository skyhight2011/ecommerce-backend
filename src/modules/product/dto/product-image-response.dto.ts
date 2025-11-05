import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProductImageResponseDto {
  @ApiProperty({
    description: 'Image unique identifier',
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
    description: 'Image URL',
    example: 'https://example.com/product-image.jpg',
  })
  @Expose()
  url: string;

  @ApiPropertyOptional({
    description: 'Image alt text',
    example: 'Product main image',
  })
  @Expose()
  alt?: string;

  @ApiProperty({
    description: 'Sort order for image display',
    example: 0,
  })
  @Expose()
  sortOrder: number;

  @ApiProperty({
    description: 'Whether this is the primary image',
    example: false,
  })
  @Expose()
  isPrimary: boolean;

  @ApiProperty({
    description: 'Image creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  @Expose()
  createdAt: Date;
}
