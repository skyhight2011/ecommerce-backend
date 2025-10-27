import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  MaxLength,
  IsPhoneNumber,
} from 'class-validator';
import { AddressType } from '../enums/address-type.enum';

export class CreateAddressDto {
  @ApiProperty({
    description: 'Address type',
    enum: AddressType,
    example: AddressType.SHIPPING,
  })
  @IsEnum(AddressType, {
    message: 'Address type must be SHIPPING, BILLING, or BOTH',
  })
  type: AddressType;

  @ApiProperty({
    description: 'First name for the address',
    example: 'John',
    maxLength: 50,
  })
  @IsString({ message: 'First name must be a string' })
  @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
  firstName: string;

  @ApiProperty({
    description: 'Last name for the address',
    example: 'Doe',
    maxLength: 50,
  })
  @IsString({ message: 'Last name must be a string' })
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters' })
  lastName: string;

  @ApiPropertyOptional({
    description: 'Company name',
    example: 'Acme Corp',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Company must be a string' })
  @MaxLength(100, { message: 'Company name cannot exceed 100 characters' })
  company?: string;

  @ApiProperty({
    description: 'Primary address line',
    example: '123 Main Street',
    maxLength: 255,
  })
  @IsString({ message: 'Address line 1 must be a string' })
  @MaxLength(255, { message: 'Address line 1 cannot exceed 255 characters' })
  address1: string;

  @ApiPropertyOptional({
    description: 'Secondary address line (apartment, suite, etc.)',
    example: 'Apt 4B',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Address line 2 must be a string' })
  @MaxLength(255, { message: 'Address line 2 cannot exceed 255 characters' })
  address2?: string;

  @ApiProperty({
    description: 'City name',
    example: 'New York',
    maxLength: 100,
  })
  @IsString({ message: 'City must be a string' })
  @MaxLength(100, { message: 'City name cannot exceed 100 characters' })
  city: string;

  @ApiPropertyOptional({
    description: 'State or province',
    example: 'NY',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'State must be a string' })
  @MaxLength(100, { message: 'State cannot exceed 100 characters' })
  state?: string;

  @ApiProperty({
    description: 'Postal or ZIP code',
    example: '10001',
    maxLength: 20,
  })
  @IsString({ message: 'Postal code must be a string' })
  @MaxLength(20, { message: 'Postal code cannot exceed 20 characters' })
  postalCode: string;

  @ApiProperty({
    description: 'Country name',
    example: 'United States',
    maxLength: 100,
  })
  @IsString({ message: 'Country must be a string' })
  @MaxLength(100, { message: 'Country name cannot exceed 100 characters' })
  country: string;

  @ApiPropertyOptional({
    description: 'Phone number for this address',
    example: '+1234567890',
  })
  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Please provide a valid phone number' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Whether this is the default address',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isDefault must be a boolean' })
  isDefault?: boolean;
}
