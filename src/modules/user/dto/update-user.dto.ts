import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { UpdateAddressDto } from './update-address.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'addresses'] as const),
) {
  @ApiPropertyOptional({
    description: 'New password (if updating password)',
    example: 'NewSecurePassword123!',
    minLength: 8,
  })
  password?: string;

  @ApiPropertyOptional({
    description: 'User addresses',
    type: [UpdateAddressDto],
  })
  addresses?: UpdateAddressDto[];

  @ApiPropertyOptional({
    description: 'Account active status',
    example: true,
  })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Email verification status',
    example: true,
  })
  isVerified?: boolean;
}
