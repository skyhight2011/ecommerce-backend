import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UserRole } from '@prisma/client';
import { USER_MESSAGES } from 'src/modules/user/constants/user-messages.constant';
import { OrderService } from './order.service';
import {
  CreateOrderDto,
  OrderListResponseDto,
  OrderQueryDto,
  OrderResponseDto,
} from './dto';
import { Roles, CurrentUser } from '../auth/decorators';
import { UserFromJwt } from '../auth/strategies';

@ApiTags('orders')
@ApiBearerAuth('JWT')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(UserRole.USER, UserRole.VENDOR)
  @ApiOperation({ summary: 'Create a new order for the current user' })
  @ApiResponse({ status: 201, type: OrderResponseDto })
  async create(
    @CurrentUser() user: UserFromJwt | null,
    @Body() dto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    if (!user) {
      throw new ForbiddenException(USER_MESSAGES.CONTEXT_REQUIRED);
    }

    const order = await this.orderService.createOrder(user.userId, dto);
    return plainToInstance(OrderResponseDto, order);
  }

  @Get()
  @Roles(UserRole.USER, UserRole.VENDOR)
  @ApiOperation({ summary: 'List orders for the current user' })
  @ApiResponse({ status: 200, type: OrderListResponseDto })
  async findAll(
    @CurrentUser() user: UserFromJwt | null,
    @Query() query: OrderQueryDto,
  ) {
    if (!user) {
      throw new ForbiddenException(USER_MESSAGES.CONTEXT_REQUIRED);
    }

    const normalizedQuery: OrderQueryDto = {
      ...query,
      page:
        query?.page !== undefined ? Number(query.page) || undefined : undefined,
      limit:
        query?.limit !== undefined
          ? Number(query.limit) || undefined
          : undefined,
    };

    const result = await this.orderService.findUserOrders(
      user.userId,
      normalizedQuery,
    );

    return plainToInstance(OrderListResponseDto, {
      ...result,
      orders: result.orders.map((order) =>
        plainToInstance(OrderResponseDto, order),
      ),
    });
  }

  @Get(':id')
  @Roles(UserRole.USER, UserRole.VENDOR)
  @ApiOperation({ summary: 'Retrieve a specific order belonging to the user' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  async findOne(
    @CurrentUser() user: UserFromJwt | null,
    @Param('id') id: string,
  ): Promise<OrderResponseDto> {
    if (!user) {
      throw new ForbiddenException(USER_MESSAGES.CONTEXT_REQUIRED);
    }

    const order = await this.orderService.findOrderForUser(user.userId, id);
    return plainToInstance(OrderResponseDto, order);
  }
}
