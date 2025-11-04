import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUrl,
  IsInt,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateProductImageDto {
  @ApiProperty({
    description: 'Image URL',
    example: 'https://example.com/product-image.jpg',
  })
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  url: string;

  @ApiPropertyOptional({
    description: 'Image alt text for accessibility',
    example: 'Product main image',
  })
  @IsOptional()
  @IsString({ message: 'Alt text must be a string' })
  alt?: string;

  @ApiPropertyOptional({
    description: 'Sort order for image display',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Sort order must be an integer' })
  @Min(0, { message: 'Sort order must be greater than or equal to 0' })
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Whether this is the primary image',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isPrimary must be a boolean' })
  isPrimary?: boolean;
}
