import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from 'src/modules/user/dto';
import { UserService } from 'src/modules/user/user.service';
import { UserRole } from 'src/modules/user/enums/user-role.enum';
import { Roles } from 'src/modules/auth/decorators';
import { UpdateUserRoleDto, UpdateUserStatusDto } from '../dto';
import { AUTH_MESSAGES } from 'src/modules/auth/constants/auth-messages.constant';

@ApiTags('admin/users')
@ApiBearerAuth('JWT')
@Roles(UserRole.SUPER_ADMIN)
@Controller('admin/users')
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'List users with optional filters' })
  @ApiQuery({ name: 'role', enum: UserRole, required: false })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'isVerified', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  async findAll(
    @Query('role') role?: UserRole,
    @Query('isActive') isActive?: string,
    @Query('isVerified') isVerified?: string,
    @Query('search') search?: string,
  ): Promise<UserResponseDto[]> {
    const filters = {
      role: role && Object.values(UserRole).includes(role) ? role : undefined,
      isActive:
        isActive === undefined
          ? undefined
          : isActive === 'true'
            ? true
            : isActive === 'false'
              ? false
              : undefined,
      isVerified:
        isVerified === undefined
          ? undefined
          : isVerified === 'true'
            ? true
            : isVerified === 'false'
              ? false
              : undefined,
      search: search?.trim() || undefined,
    } as const;

    const users = await this.userService.findAll(filters);
    return plainToInstance(UserResponseDto, users);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve user by id' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return plainToInstance(UserResponseDto, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(AUTH_MESSAGES.USER_ALREADY_EXISTS);
    }
    const user = await this.userService.createUser(dto);
    return plainToInstance(UserResponseDto, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.updateUser(id, dto);
    return plainToInstance(UserResponseDto, user);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update user account status flags' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.updateUserStatus(id, dto);
    return plainToInstance(UserResponseDto, user);
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Update user role' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.updateUserRole(id, dto.role);
    return plainToInstance(UserResponseDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate user account' })
  @ApiResponse({ status: 200, description: 'User deactivated successfully' })
  async remove(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
