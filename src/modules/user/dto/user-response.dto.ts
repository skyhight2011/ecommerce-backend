import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';
import { AddressResponseDto } from './address-response.dto';

export class UserResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: 'clx1234567890abcdef',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @Expose()
  email: string;

  @ApiPropertyOptional({
    description: 'Username',
    example: 'johndoe123',
  })
  @Expose()
  username?: string;

  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
  })
  @Expose()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
  })
  @Expose()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
  })
  @Expose()
  phone?: string;

  @ApiPropertyOptional({
    description: 'URL to user avatar image',
    example: 'https://example.com/avatar.jpg',
  })
  @Expose()
  avatar?: string;

  @ApiProperty({
    description: 'Account active status',
    example: true,
  })
  @Expose()
  isActive: boolean;

  @ApiProperty({
    description: 'Email verification status',
    example: false,
  })
  @Expose()
  isVerified: boolean;

  @ApiPropertyOptional({
    description: 'Email verification timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  @Expose()
  emailVerifiedAt?: Date;

  @ApiPropertyOptional({
    description: 'Phone verification timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  @Expose()
  phoneVerifiedAt?: Date;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.CUSTOMER,
  })
  @Expose()
  role: UserRole;

  @ApiProperty({
    description: 'Array of user permissions',
    example: ['read:products', 'write:orders'],
    type: [String],
  })
  @Expose()
  permissions: string[];

  @ApiProperty({
    description: 'Account creation timestamp',
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

  @ApiPropertyOptional({
    description: 'Last login timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  @Expose()
  lastLoginAt?: Date;

  @ApiPropertyOptional({
    description: 'User addresses',
    type: [AddressResponseDto],
  })
  @Expose()
  @Type(() => AddressResponseDto)
  addresses?: AddressResponseDto[];

  @ApiPropertyOptional({
    description: 'User preferences as JSON object',
    example: { theme: 'dark', notifications: true },
  })
  @Expose()
  preferences?: Record<string, any>;

  // Exclude sensitive fields from response
  @Exclude()
  password: string;
}
