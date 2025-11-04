import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProductAttributeResponseDto {
  @ApiProperty({
    description: 'Attribute unique identifier',
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
    description: 'Attribute name',
    example: 'Color',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Attribute value',
    example: 'Red',
  })
  @Expose()
  value: string;

  @ApiProperty({
    description: 'Sort order for attribute display',
    example: 0,
  })
  @Expose()
  sortOrder: number;
}
