import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  IsEnum,
  IsArray,
  IsObject,
  Min,
  ValidateNested,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '../enums';
import { CreateProductImageDto } from './create-product-image.dto';
import { CreateProductVariantDto } from './create-product-variant.dto';
import { CreateProductAttributeDto } from './create-product-attribute.dto';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Premium Cotton T-Shirt',
    minLength: 1,
    maxLength: 255,
  })
  @IsString({ message: 'Product name must be a string' })
  @IsNotEmpty({ message: 'Product name is required' })
  @MinLength(1, { message: 'Product name must be at least 1 character long' })
  @MaxLength(255, { message: 'Product name cannot exceed 255 characters' })
  name: string;

  @ApiProperty({
    description: 'Product slug (URL-friendly identifier)',
    example: 'premium-cotton-t-shirt',
  })
  @IsString({ message: 'Slug must be a string' })
  @IsNotEmpty({ message: 'Slug is required' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase alphanumeric with hyphens only',
  })
  slug: string;

  @ApiPropertyOptional({
    description: 'Full product description',
    example: 'A premium quality cotton t-shirt perfect for everyday wear.',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Short product description for listings',
    example: 'Premium cotton t-shirt',
  })
  @IsOptional()
  @IsString({ message: 'Short description must be a string' })
  shortDescription?: string;

  @ApiProperty({
    description: 'Product price',
    example: '29.99',
  })
  @IsString({ message: 'Price must be a string representation of a decimal' })
  @IsNotEmpty({ message: 'Price is required' })
  price: string;

  @ApiPropertyOptional({
    description: 'Compare price (original price for discounts)',
    example: '39.99',
  })
  @IsOptional()
  @IsString({
    message: 'Compare price must be a string representation of a decimal',
  })
  comparePrice?: string;

  @ApiPropertyOptional({
    description: 'Cost price (for profit calculation)',
    example: '15.00',
  })
  @IsOptional()
  @IsString({
    message: 'Cost price must be a string representation of a decimal',
  })
  costPrice?: string;

  @ApiProperty({
    description: 'Category ID',
    example: 'clx1234567890abcdef',
  })
  @IsString({ message: 'Category ID must be a string' })
  @IsNotEmpty({ message: 'Category ID is required' })
  categoryId: string;

  @ApiPropertyOptional({
    description: 'Product SKU',
    example: 'PROD-001',
  })
  @IsOptional()
  @IsString({ message: 'SKU must be a string' })
  sku?: string;

  @ApiPropertyOptional({
    description: 'Product barcode',
    example: '1234567890123',
  })
  @IsOptional()
  @IsString({ message: 'Barcode must be a string' })
  barcode?: string;

  @ApiPropertyOptional({
    description: 'Track quantity in stock',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'trackQuantity must be a boolean' })
  trackQuantity?: boolean;

  @ApiPropertyOptional({
    description: 'Quantity in stock',
    example: 100,
    default: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(0, { message: 'Quantity must be greater than or equal to 0' })
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Low stock threshold',
    example: 5,
    default: 5,
  })
  @IsOptional()
  @IsInt({ message: 'Low stock threshold must be an integer' })
  @Min(0, { message: 'Low stock threshold must be greater than or equal to 0' })
  lowStockThreshold?: number;

  @ApiPropertyOptional({
    description: 'Product weight in kg',
    example: '0.5',
  })
  @IsOptional()
  @IsString({ message: 'Weight must be a string representation of a decimal' })
  weight?: string;

  @ApiPropertyOptional({
    description:
      'Product dimensions as JSON object (e.g., {length: 30, width: 25, height: 5})',
    example: { length: 30, width: 25, height: 5 },
  })
  @IsOptional()
  @IsObject({ message: 'Dimensions must be an object' })
  dimensions?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Product material',
    example: '100% Cotton',
  })
  @IsOptional()
  @IsString({ message: 'Material must be a string' })
  material?: string;

  @ApiPropertyOptional({
    description: 'Product brand',
    example: 'BrandName',
  })
  @IsOptional()
  @IsString({ message: 'Brand must be a string' })
  brand?: string;

  @ApiPropertyOptional({
    description: 'Product status',
    enum: ProductStatus,
    default: ProductStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(ProductStatus, { message: 'Status must be a valid ProductStatus' })
  status?: ProductStatus;

  @ApiPropertyOptional({
    description: 'Whether product is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Whether product is digital',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isDigital must be a boolean' })
  isDigital?: boolean;

  @ApiPropertyOptional({
    description: 'Whether product is featured',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isFeatured must be a boolean' })
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: 'SEO meta title',
    example: 'Premium Cotton T-Shirt - BrandName',
  })
  @IsOptional()
  @IsString({ message: 'Meta title must be a string' })
  metaTitle?: string;

  @ApiPropertyOptional({
    description: 'SEO meta description',
    example: 'Shop premium cotton t-shirts online.',
  })
  @IsOptional()
  @IsString({ message: 'Meta description must be a string' })
  metaDescription?: string;

  @ApiPropertyOptional({
    description: 'Product images',
    type: [CreateProductImageDto],
  })
  @IsOptional()
  @IsArray({ message: 'Images must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  images?: CreateProductImageDto[];

  @ApiPropertyOptional({
    description: 'Product variants',
    type: [CreateProductVariantDto],
  })
  @IsOptional()
  @IsArray({ message: 'Variants must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];

  @ApiPropertyOptional({
    description: 'Product attributes',
    type: [CreateProductAttributeDto],
  })
  @IsOptional()
  @IsArray({ message: 'Attributes must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CreateProductAttributeDto)
  attributes?: CreateProductAttributeDto[];
}
