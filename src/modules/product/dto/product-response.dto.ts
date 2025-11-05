import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProductStatus } from '../enums';
import { ProductImageResponseDto } from './product-image-response.dto';
import { ProductVariantResponseDto } from './product-variant-response.dto';
import { ProductAttributeResponseDto } from './product-attribute-response.dto';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product unique identifier',
    example: 'clx1234567890abcdef',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Premium Cotton T-Shirt',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Product slug',
    example: 'premium-cotton-t-shirt',
  })
  @Expose()
  slug: string;

  @ApiPropertyOptional({
    description: 'Full product description',
    example: 'A premium quality cotton t-shirt perfect for everyday wear.',
  })
  @Expose()
  description?: string;

  @ApiPropertyOptional({
    description: 'Short product description',
    example: 'Premium cotton t-shirt',
  })
  @Expose()
  shortDescription?: string;

  @ApiProperty({
    description: 'Product price',
    example: '29.99',
  })
  @Expose()
  price: string;

  @ApiPropertyOptional({
    description: 'Compare price',
    example: '39.99',
  })
  @Expose()
  comparePrice?: string;

  @ApiPropertyOptional({
    description: 'Cost price',
    example: '15.00',
  })
  @Expose()
  costPrice?: string;

  @ApiProperty({
    description: 'Category ID',
    example: 'clx1234567890abcdef',
  })
  @Expose()
  categoryId: string;

  @ApiPropertyOptional({
    description: 'Category name',
    example: 'T-Shirts',
  })
  @Expose()
  category?: {
    id: string;
    name: string;
    slug: string;
  };

  @ApiPropertyOptional({
    description: 'Product SKU',
    example: 'PROD-001',
  })
  @Expose()
  sku?: string;

  @ApiPropertyOptional({
    description: 'Product barcode',
    example: '1234567890123',
  })
  @Expose()
  barcode?: string;

  @ApiProperty({
    description: 'Track quantity in stock',
    example: true,
  })
  @Expose()
  trackQuantity: boolean;

  @ApiProperty({
    description: 'Quantity in stock',
    example: 100,
  })
  @Expose()
  quantity: number;

  @ApiProperty({
    description: 'Low stock threshold',
    example: 5,
  })
  @Expose()
  lowStockThreshold: number;

  @ApiPropertyOptional({
    description: 'Product weight in kg',
    example: '0.5',
  })
  @Expose()
  weight?: string;

  @ApiPropertyOptional({
    description: 'Product dimensions',
    example: { length: 30, width: 25, height: 5 },
  })
  @Expose()
  dimensions?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Product material',
    example: '100% Cotton',
  })
  @Expose()
  material?: string;

  @ApiPropertyOptional({
    description: 'Product brand',
    example: 'BrandName',
  })
  @Expose()
  brand?: string;

  @ApiProperty({
    description: 'Product status',
    enum: ProductStatus,
    example: ProductStatus.PUBLISHED,
  })
  @Expose()
  status: ProductStatus;

  @ApiProperty({
    description: 'Whether product is active',
    example: true,
  })
  @Expose()
  isActive: boolean;

  @ApiProperty({
    description: 'Whether product is digital',
    example: false,
  })
  @Expose()
  isDigital: boolean;

  @ApiProperty({
    description: 'Whether product is featured',
    example: false,
  })
  @Expose()
  isFeatured: boolean;

  @ApiPropertyOptional({
    description: 'SEO meta title',
    example: 'Premium Cotton T-Shirt - BrandName',
  })
  @Expose()
  metaTitle?: string;

  @ApiPropertyOptional({
    description: 'SEO meta description',
    example: 'Shop premium cotton t-shirts online.',
  })
  @Expose()
  metaDescription?: string;

  @ApiProperty({
    description: 'Product creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Product update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  @Expose()
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Product publication timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  @Expose()
  publishedAt?: Date;

  @ApiPropertyOptional({
    description: 'Product images',
    type: [ProductImageResponseDto],
  })
  @Expose()
  @Type(() => ProductImageResponseDto)
  images?: ProductImageResponseDto[];

  @ApiPropertyOptional({
    description: 'Product variants',
    type: [ProductVariantResponseDto],
  })
  @Expose()
  @Type(() => ProductVariantResponseDto)
  variants?: ProductVariantResponseDto[];

  @ApiPropertyOptional({
    description: 'Product attributes',
    type: [ProductAttributeResponseDto],
  })
  @Expose()
  @Type(() => ProductAttributeResponseDto)
  attributes?: ProductAttributeResponseDto[];
}
