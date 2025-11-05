import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserRole } from 'src/modules/user/enums/user-role.enum';
import { AUTH_MESSAGES } from './constants/auth-messages.constant';
import { USER_MESSAGES } from 'src/modules/user/constants/user-messages.constant';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException(AUTH_MESSAGES.USER_ALREADY_EXISTS);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Generate username if not provided
    const username =
      registerDto.username || this.generateUsernameFromEmail(registerDto.email);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        username,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        phone: registerDto.phone,
        isActive: true,
        isVerified: false,
      },
    });

    // Generate JWT
    const token = this.generateToken(user.id, user.email, user.role);

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken: token,
    };
  }

  async login(loginDto: LoginDto) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user?.email) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    // Check if account is active
    if (!user?.isActive) {
      throw new UnauthorizedException(AUTH_MESSAGES.ACCOUNT_INACTIVE);
    }

    // Check if account is verified (optional, depends on your requirements)
    if (!user?.isVerified) {
      throw new UnauthorizedException(AUTH_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    // Update last login time
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate JWT
    const token = this.generateToken(user.id, user.email, user.role);

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken: token,
    };
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(USER_MESSAGES.NOT_FOUND);
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      updatePasswordDto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException(AUTH_MESSAGES.CURRENT_PASSWORD_INCORRECT);
    }

    // Check if new password is different from current
    const isSamePassword = await bcrypt.compare(
      updatePasswordDto.newPassword,
      user.password,
    );

    if (isSamePassword) {
      throw new BadRequestException(AUTH_MESSAGES.NEW_PASSWORD_DIFFERENT);
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(
      updatePasswordDto.newPassword,
      10,
    );

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: AUTH_MESSAGES.PASSWORD_UPDATE_SUCCESS };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    return user;
  }

  private generateToken(userId: string, email: string, role: UserRole): string {
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload);
  }

  private generateUsernameFromEmail(email: string): string {
    const base = email.split('@')[0];
    const randomSuffix = Math.floor(Math.random() * 10000);
    return `${base}-${randomSuffix}`;
  }
}
