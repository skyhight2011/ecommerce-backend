import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['slug'] as const),
) {
  @ApiPropertyOptional({
    description:
      'Published timestamp (set when product status changes to PUBLISHED)',
    example: '2024-01-15T10:30:00Z',
  })
  publishedAt?: Date;
}
