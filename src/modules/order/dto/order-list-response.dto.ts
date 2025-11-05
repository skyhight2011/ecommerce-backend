import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { OrderResponseDto } from './order-response.dto';

export class OrderListResponseDto {
  @ApiProperty({ type: [OrderResponseDto] })
  @Expose()
  @Type(() => OrderResponseDto)
  orders!: OrderResponseDto[];

  @ApiProperty({ description: 'Total number of orders matching the query' })
  @Expose()
  total!: number;

  @ApiProperty({ description: 'Current page number' })
  @Expose()
  page!: number;

  @ApiProperty({ description: 'Page size' })
  @Expose()
  limit!: number;
}
