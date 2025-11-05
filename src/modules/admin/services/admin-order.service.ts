import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  FulfillmentStatus,
  OrderStatus,
  PaymentStatus,
  Prisma,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOrderStatusDto } from '../dto';

@Injectable()
export class AdminOrderService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    page = 1,
    limit = 20,
    filters?: {
      status?: OrderStatus;
      paymentStatus?: PaymentStatus;
      fulfillmentStatus?: FulfillmentStatus;
      customerEmail?: string;
      orderNumber?: string;
    },
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.paymentStatus) {
      where.paymentStatus = filters.paymentStatus;
    }

    if (filters?.fulfillmentStatus) {
      where.fulfillmentStatus = filters.fulfillmentStatus;
    }

    if (filters?.customerEmail) {
      where.customerEmail = {
        contains: filters.customerEmail,
        mode: 'insensitive',
      };
    }

    if (filters?.orderNumber) {
      where.orderNumber = {
        contains: filters.orderNumber,
        mode: 'insensitive',
      };
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: this.defaultOrderInclude,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders,
      total,
      page,
      limit,
    };
  }

  async findById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: this.defaultOrderInclude,
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }

  async updateStatuses(id: string, dto: UpdateOrderStatusDto) {
    const updateData: Prisma.OrderUpdateInput = {};

    if (dto.status) {
      updateData.status = dto.status;
    }

    if (dto.paymentStatus) {
      updateData.paymentStatus = dto.paymentStatus;
    }

    if (dto.fulfillmentStatus) {
      updateData.fulfillmentStatus = dto.fulfillmentStatus;
    }

    if (dto.trackingNumber !== undefined) {
      updateData.trackingNumber = dto.trackingNumber;
    }

    if (dto.notes !== undefined) {
      updateData.notes = dto.notes;
    }

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('At least one field must be provided');
    }

    try {
      return await this.prisma.order.update({
        where: { id },
        data: updateData,
        include: this.defaultOrderInclude,
      });
    } catch {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
  }

  private get defaultOrderInclude(): Prisma.OrderInclude {
    return {
      items: true,
      payments: true,
      refunds: true,
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      },
      shippingAddress: true,
      billingAddress: true,
    };
  }
}
