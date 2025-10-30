import {
  Controller,
  Post,
  Put,
  Body,
  UseGuards,
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
import { JwtAuthGuard } from './guards';
import { CurrentUser } from './decorators';
import { UserFromJwt } from './strategies';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
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
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Put('password')
  @UseGuards(JwtAuthGuard)
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
      throw new ForbiddenException('User not found or unauthorized');
    }
    return this.authService.updatePassword(user.userId, updatePasswordDto);
  }
}
