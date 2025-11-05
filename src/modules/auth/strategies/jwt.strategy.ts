import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from 'src/modules/user/enums/user-role.enum';
import { AUTH_MESSAGES } from '../constants/auth-messages.constant';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
}

export interface UserFromJwt {
  userId: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('jwt.secret', { infer: true }) ||
        process.env.JWT_SECRET ||
        'defaultSecret',
    });
  }

  async validate(payload: JwtPayload): Promise<UserFromJwt> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive || !user.isVerified) {
      throw new UnauthorizedException(AUTH_MESSAGES.USER_NOT_FOUND_OR_INACTIVE);
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
