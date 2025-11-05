import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Put,
  Body,
  ConflictException,
  Param,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto';
import { UserService } from './user.service';
import { plainToClass } from 'class-transformer';
import { USER_MESSAGES } from './constants/user-messages.constant';
import { AUTH_MESSAGES } from '../auth/constants/auth-messages.constant';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [UserResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userService.findAll();
    return users.map((user) => plainToClass(UserResponseDto, user));
  }

  @Get(':id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    if (!id) {
      throw new BadRequestException(USER_MESSAGES.ID_REQUIRED);
    }
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException(USER_MESSAGES.NOT_FOUND);
    }
    if (user.isActive === false) {
      throw new ForbiddenException(USER_MESSAGES.NOT_ACTIVE);
    }
    if (user.isVerified === false) {
      throw new ForbiddenException(USER_MESSAGES.NOT_VERIFIED);
    }
    return user as UserResponseDto;
  }

  @Put()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  async createUser(@Body() user: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userService.findByEmail(user.email);
    if (existingUser) {
      throw new ConflictException(AUTH_MESSAGES.USER_ALREADY_EXISTS, {
        description: AUTH_MESSAGES.USER_ALREADY_EXISTS,
      });
    }

    const createdUser = await this.userService.createUser(user);
    return plainToClass(UserResponseDto, createdUser);
  }

  @Put(':id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async updateUser(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const existingUser = await this.userService.findById(id);
    if (!existingUser) {
      throw new NotFoundException(USER_MESSAGES.NOT_FOUND);
    }
    await this.userService.updateUser(id, user);
    return plainToClass(UserResponseDto, existingUser);
  }
}
