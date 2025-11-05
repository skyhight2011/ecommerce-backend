import {
  Controller,
  Post,
  Put,
  Body,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, UpdatePasswordDto } from './dto';
import { CurrentUser, Public } from './decorators';
import { UserFromJwt } from './strategies';
import { AUTH_MESSAGES } from './constants/auth-messages.constant';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Put('password')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or incorrect current password',
  })
  async updatePassword(
    @CurrentUser() user: UserFromJwt | null,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    if (!user || !user.userId) {
      throw new ForbiddenException(
        AUTH_MESSAGES.USER_NOT_FOUND_OR_UNAUTHORIZED,
      );
    }
    return this.authService.updatePassword(user.userId, updatePasswordDto);
  }
}
