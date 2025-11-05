import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  FulfillmentStatus,
  OrderStatus,
  PaymentStatus,
  Prisma,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto, OrderQueryDto } from './dto';
import { ORDER_MESSAGES } from './constants/order-messages.constant';
import { USER_MESSAGES } from 'src/modules/user/constants/user-messages.constant';

type TransactionClient = Prisma.TransactionClient;

@Injectable()
export class OrderService {
  private readonly defaultOrderInclude: Prisma.OrderInclude = {
    items: true,
    shippingAddress: true,
    billingAddress: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  get orderInclude(): Prisma.OrderInclude {
    return this.defaultOrderInclude;
  }

  async createOrder(userId: string, dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException(ORDER_MESSAGES.ITEMS_REQUIRED);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new NotFoundException(USER_MESSAGES.NOT_FOUND);
    }

    if (!user.isActive) {
      throw new ForbiddenException(USER_MESSAGES.ACCOUNT_INACTIVE);
    }

    const shippingAmount = new Prisma.Decimal(dto.shippingAmount ?? 0);
    const taxAmount = new Prisma.Decimal(dto.taxAmount ?? 0);
    const discountAmount = new Prisma.Decimal(dto.discountAmount ?? 0);

    return this.prisma.$transaction(async (tx) => {
      const { orderData, productAdjustments, variantAdjustments } =
        await this.buildOrderData(
          tx,
          userId,
          user.email,
          user.phone ?? null,
          dto,
        );

      const subtotal = orderData.items.reduce(
        (acc, item) => acc.plus(Number(item.total)),
        new Prisma.Decimal(0),
      );

      let total = subtotal
        .plus(shippingAmount)
        .plus(taxAmount)
        .minus(discountAmount);
      if (total.lessThan(0)) {
        total = new Prisma.Decimal(0);
      }

      const currency = dto.currency ?? 'USD';
      const orderNumber = await this.generateOrderNumber(tx);

      for (const [productId, adjustment] of productAdjustments.entries()) {
        if (!adjustment.trackQuantity) {
          continue;
        }
        await tx.product.update({
          where: { id: productId },
          data: {
            quantity: {
              decrement: adjustment.quantity,
            },
          },
        });
      }

      for (const [variantId, quantity] of variantAdjustments.entries()) {
        await tx.productVariant.update({
          where: { id: variantId },
          data: {
            quantity: {
              decrement: quantity,
            },
          },
        });
      }

      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          fulfillmentStatus: FulfillmentStatus.UNFULFILLED,
          subtotal,
          taxAmount,
          shippingAmount,
          discountAmount,
          total,
          currency,
          customerEmail: orderData.customerEmail,
          customerPhone: orderData.customerPhone,
          shippingMethod: dto.shippingMethod,
          notes: dto.notes,
          metadata: dto.metadata
            ? (dto.metadata as Prisma.InputJsonValue)
            : undefined,
          shippingAddressId: orderData.shippingAddressId,
          billingAddressId: orderData.billingAddressId,
          items: {
            create: orderData.items,
          },
        },
        include: this.defaultOrderInclude,
      });

      return order;
    });
  }

  async findUserOrders(userId: string, query?: OrderQueryDto) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      userId,
    };

    if (query?.status) {
      where.status = query.status;
    }

    if (query?.paymentStatus) {
      where.paymentStatus = query.paymentStatus;
    }

    if (query?.fulfillmentStatus) {
      where.fulfillmentStatus = query.fulfillmentStatus;
    }

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: this.defaultOrderInclude,
      }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit };
  }

  async findOrderForUser(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: this.defaultOrderInclude,
    });

    if (!order) {
      throw new NotFoundException(ORDER_MESSAGES.NOT_FOUND);
    }

    return order;
  }

  async findMany(options: {
    page?: number;
    limit?: number;
    filters?: {
      userId?: string;
      status?: OrderStatus;
      paymentStatus?: PaymentStatus;
      fulfillmentStatus?: FulfillmentStatus;
      customerEmail?: string;
      orderNumber?: string;
    };
    include?: Prisma.OrderInclude;
  }) {
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};

    if (options.filters?.userId) {
      where.userId = options.filters.userId;
    }

    if (options.filters?.status) {
      where.status = options.filters.status;
    }

    if (options.filters?.paymentStatus) {
      where.paymentStatus = options.filters.paymentStatus;
    }

    if (options.filters?.fulfillmentStatus) {
      where.fulfillmentStatus = options.filters.fulfillmentStatus;
    }

    if (options.filters?.customerEmail) {
      where.customerEmail = {
        contains: options.filters.customerEmail,
        mode: 'insensitive',
      };
    }

    if (options.filters?.orderNumber) {
      where.orderNumber = {
        contains: options.filters.orderNumber,
        mode: 'insensitive',
      };
    }

    const include = options.include ?? this.defaultOrderInclude;

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include,
      }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit };
  }

  private async buildOrderData(
    tx: TransactionClient,
    userId: string,
    customerEmail: string,
    fallbackPhone: string | null,
    dto: CreateOrderDto,
  ) {
    const productAdjustments = new Map<
      string,
      { quantity: number; trackQuantity: boolean }
    >();
    const variantAdjustments = new Map<string, number>();

    const orderItems: Prisma.OrderItemCreateWithoutOrderInput[] = [];

    const customerPhone: string | null = dto.phone ?? fallbackPhone ?? null;

    const shippingAddressId = dto.shippingAddressId
      ? await this.ensureAddressOwnership(tx, userId, dto.shippingAddressId)
      : null;

    const billingAddressId = dto.billingAddressId
      ? await this.ensureAddressOwnership(tx, userId, dto.billingAddressId)
      : null;

    for (const item of dto.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        select: {
          id: true,
          name: true,
          sku: true,
          price: true,
          quantity: true,
          trackQuantity: true,
          isActive: true,
        },
      });

      if (!product || !product.isActive) {
        throw new BadRequestException(ORDER_MESSAGES.PRODUCT_UNAVAILABLE);
      }

      const quantityAlreadyAllocated =
        productAdjustments.get(product.id)?.quantity ?? 0;

      if (
        product.trackQuantity &&
        product.quantity - quantityAlreadyAllocated < item.quantity
      ) {
        throw new BadRequestException(ORDER_MESSAGES.PRODUCT_INSUFFICIENT);
      }

      let variant: {
        id: string;
        name: string | null;
        sku: string | null;
        price: Prisma.Decimal | null;
        quantity: number;
        isActive: boolean;
      } | null = null;

      if (item.variantId) {
        variant = await tx.productVariant.findFirst({
          where: { id: item.variantId, productId: item.productId },
          select: {
            id: true,
            name: true,
            sku: true,
            price: true,
            quantity: true,
            isActive: true,
          },
        });

        if (!variant || !variant.isActive) {
          throw new BadRequestException(ORDER_MESSAGES.VARIANT_UNAVAILABLE);
        }

        const allocatedVariantQuantity =
          variantAdjustments.get(variant.id) ?? 0;
        if (variant.quantity - allocatedVariantQuantity < item.quantity) {
          throw new BadRequestException(ORDER_MESSAGES.VARIANT_INSUFFICIENT);
        }

        variantAdjustments.set(
          variant.id,
          allocatedVariantQuantity + item.quantity,
        );
      }

      const unitPrice = new Prisma.Decimal(
        variant?.price ?? product.price ?? 0,
      );
      const lineTotal = unitPrice.mul(new Prisma.Decimal(item.quantity));

      orderItems.push({
        product: { connect: { id: product.id } },
        variant: variant ? { connect: { id: variant.id } } : undefined,
        productName: product.name,
        productSku: variant?.sku ?? product.sku,
        variantName: variant?.name,
        price: unitPrice,
        quantity: item.quantity,
        total: lineTotal,
      });

      productAdjustments.set(product.id, {
        quantity: quantityAlreadyAllocated + item.quantity,
        trackQuantity: product.trackQuantity,
      });
    }

    return {
      orderData: {
        customerEmail,
        customerPhone,
        shippingAddressId,
        billingAddressId,
        items: orderItems,
      },
      productAdjustments,
      variantAdjustments,
    };
  }

  private async ensureAddressOwnership(
    tx: TransactionClient,
    userId: string,
    addressId: string,
  ) {
    const address = await tx.address.findUnique({
      where: { id: addressId },
      select: { id: true, userId: true },
    });

    if (!address || address.userId !== userId) {
      throw new ForbiddenException(ORDER_MESSAGES.ADDRESS_FORBIDDEN);
    }

    return address.id;
  }

  private async generateOrderNumber(
    tx: TransactionClient,
    attempts = 0,
  ): Promise<string> {
    const candidate = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')}`;

    const existing = await tx.order.findUnique({
      where: { orderNumber: candidate },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }

    if (attempts > 5) {
      return `ORD-${Date.now()}-${randomUUID().slice(0, 8)}`;
    }

    return this.generateOrderNumber(tx, attempts + 1);
  }
}
