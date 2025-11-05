import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdateAddressDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: {
    role?: UserRole;
    isActive?: boolean;
    isVerified?: boolean;
    search?: string;
  }): Promise<User[]> {
    const where: Prisma.UserWhereInput = {};

    if (filters?.role) {
      where.role = filters.role;
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.isVerified !== undefined) {
      where.isVerified = filters.isVerified;
    }

    if (filters?.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await this.prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
        username: user.username || this.generateUsernameFromEmail(user.email),
        addresses: user.addresses ? { create: user.addresses } : undefined,
      },
    });
    return createdUser;
  }
  async updateUser(id: string, user: UpdateUserDto): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...user,
        password: user.password
          ? await bcrypt.hash(user.password, 10)
          : undefined,
        addresses: user.addresses
          ? {
              updateMany: user.addresses.map((address: UpdateAddressDto) => ({
                where: { id: address.id },
                data: {
                  ...address,
                },
              })),
            }
          : undefined,
      },
    });
    return updatedUser;
  }
  async deleteUser(id: string): Promise<{ message: string } | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        isVerified: false,
        updatedAt: new Date(),
      },
    });
    return { message: 'User deactivated successfully' } as { message: string };
  }

  async updateUserRole(id: string, role: UserRole): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  async updateUserStatus(
    id: string,
    status: { isActive?: boolean; isVerified?: boolean },
  ): Promise<User> {
    const updateData: Prisma.UserUpdateInput = {};

    if (status.isActive !== undefined) {
      updateData.isActive = status.isActive;
    }

    if (status.isVerified !== undefined) {
      updateData.isVerified = status.isVerified;
    }

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException(
        'At least one status field must be provided',
      );
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateData,
      });
    } catch {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  private generateUsernameFromEmail(email: string): string {
    const base = email.split('@')[0];
    const randomSuffix = Math.floor(Math.random() * 10000);
    return `${base}-${randomSuffix}`;
  }
}
