import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AddressType } from '../enums/address-type.enum';

export class AddressResponseDto {
  @ApiProperty({
    description: 'Address unique identifier',
    example: 'clx1234567890abcdef',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'User ID this address belongs to',
    example: 'clx1234567890abcdef',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    description: 'Address type',
    enum: AddressType,
    example: AddressType.SHIPPING,
  })
  @Expose()
  type: AddressType;

  @ApiProperty({
    description: 'First name for the address',
    example: 'John',
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    description: 'Last name for the address',
    example: 'Doe',
  })
  @Expose()
  lastName: string;

  @ApiPropertyOptional({
    description: 'Company name',
    example: 'Acme Corp',
  })
  @Expose()
  company?: string;

  @ApiProperty({
    description: 'Primary address line',
    example: '123 Main Street',
  })
  @Expose()
  address1: string;

  @ApiPropertyOptional({
    description: 'Secondary address line',
    example: 'Apt 4B',
  })
  @Expose()
  address2?: string;

  @ApiProperty({
    description: 'City name',
    example: 'New York',
  })
  @Expose()
  city: string;

  @ApiPropertyOptional({
    description: 'State or province',
    example: 'NY',
  })
  @Expose()
  state?: string;

  @ApiProperty({
    description: 'Postal or ZIP code',
    example: '10001',
  })
  @Expose()
  postalCode: string;

  @ApiProperty({
    description: 'Country name',
    example: 'United States',
  })
  @Expose()
  country: string;

  @ApiPropertyOptional({
    description: 'Phone number for this address',
    example: '+1234567890',
  })
  @Expose()
  phone?: string;

  @ApiProperty({
    description: 'Whether this is the default address',
    example: false,
  })
  @Expose()
  isDefault: boolean;

  @ApiProperty({
    description: 'Address creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  @Expose()
  updatedAt: Date;
}
