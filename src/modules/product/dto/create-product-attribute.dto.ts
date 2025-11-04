import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateProductAttributeDto {
  @ApiProperty({
    description: 'Attribute name (e.g., "Color", "Size", "Material")',
    example: 'Color',
  })
  @IsString({ message: 'Attribute name must be a string' })
  name: string;

  @ApiProperty({
    description: 'Attribute value (e.g., "Red", "Large", "Cotton")',
    example: 'Red',
  })
  @IsString({ message: 'Attribute value must be a string' })
  value: string;

  @ApiPropertyOptional({
    description: 'Sort order for attribute display',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Sort order must be an integer' })
  @Min(0, { message: 'Sort order must be greater than or equal to 0' })
  sortOrder?: number;
}
