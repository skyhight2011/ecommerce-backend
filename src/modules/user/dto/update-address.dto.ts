import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAddressDto } from './address.dto';
import { IsString, IsUUID } from 'class-validator';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  @ApiProperty({
    description: 'The ID of the address to update',
    example: 'uuid-address-id',
  })
  @IsString()
  @IsUUID()
  id: string;
}
