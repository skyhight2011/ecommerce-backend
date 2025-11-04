import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsObject,
  Min,
} from 'class-validator';

export class CreateProductVariantDto {
  @ApiProperty({
    description: 'Variant name (e.g., "Red - Large")',
    example: 'Red - Large',
  })
  @IsString({ message: 'Variant name must be a string' })
  name: string;

  @ApiPropertyOptional({
    description: 'Variant SKU',
    example: 'PROD-001-RED-L',
  })
  @IsOptional()
  @IsString({ message: 'SKU must be a string' })
  sku?: string;

  @ApiPropertyOptional({
    description: 'Variant price (overrides product price)',
    example: '29.99',
  })
  @IsOptional()
  @IsString({ message: 'Price must be a string representation of a decimal' })
  price?: string;

  @ApiPropertyOptional({
    description: 'Variant quantity in stock',
    example: 50,
    default: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(0, { message: 'Quantity must be greater than or equal to 0' })
  quantity?: number;

  @ApiProperty({
    description:
      'Variant attributes as JSON object (e.g., {color: "red", size: "large"})',
    example: { color: 'red', size: 'large' },
  })
  @IsObject({ message: 'Attributes must be an object' })
  attributes: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Whether variant is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;
}
