import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserStatusDto {
  @ApiPropertyOptional({ description: 'Set user active flag' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Set user verification flag' })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
