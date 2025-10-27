import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdateAddressDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
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

  private generateUsernameFromEmail(email: string): string {
    const base = email.split('@')[0];
    const randomSuffix = Math.floor(Math.random() * 10000);
    return `${base}-${randomSuffix}`;
  }
}
