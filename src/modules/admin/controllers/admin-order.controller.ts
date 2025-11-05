import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FulfillmentStatus, OrderStatus, PaymentStatus } from '@prisma/client';
import { Roles } from 'src/modules/auth/decorators';
import { UserRole } from 'src/modules/user/enums/user-role.enum';
import { AdminOrderService } from '../services/admin-order.service';
import { UpdateOrderStatusDto } from '../dto';

@ApiTags('admin/orders')
@ApiBearerAuth('JWT')
@Roles(UserRole.SUPER_ADMIN, UserRole.SUPPORT_ADMIN)
@Controller('admin/orders')
export class AdminOrderController {
  constructor(private readonly adminOrderService: AdminOrderService) {}

  @Get()
  @ApiOperation({ summary: 'List orders with optional filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  @ApiQuery({ name: 'paymentStatus', required: false, enum: PaymentStatus })
  @ApiQuery({
    name: 'fulfillmentStatus',
    required: false,
    enum: FulfillmentStatus,
  })
  @ApiQuery({ name: 'orderNumber', required: false, type: String })
  @ApiQuery({ name: 'customerEmail', required: false, type: String })
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('status') status?: OrderStatus,
    @Query('paymentStatus') paymentStatus?: PaymentStatus,
    @Query('fulfillmentStatus') fulfillmentStatus?: FulfillmentStatus,
    @Query('orderNumber') orderNumber?: string,
    @Query('customerEmail') customerEmail?: string,
  ) {
    return this.adminOrderService.findAll(
      Number(page) || 1,
      Number(limit) || 20,
      {
        status,
        paymentStatus,
        fulfillmentStatus,
        orderNumber: orderNumber?.trim() || undefined,
        customerEmail: customerEmail?.trim() || undefined,
      },
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by id' })
  async findById(@Param('id') id: string) {
    return this.adminOrderService.findById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order statuses' })
  @ApiResponse({ status: 200 })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.adminOrderService.updateStatuses(id, dto);
  }
}
