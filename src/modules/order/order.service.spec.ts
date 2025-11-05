import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('OrderService', () => {
  let service: OrderService;

  const prismaMock = {
    user: { findUnique: jest.fn() },
    order: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
    product: { findUnique: jest.fn(), update: jest.fn() },
    productVariant: { findFirst: jest.fn(), update: jest.fn() },
    address: { findUnique: jest.fn() },
    $transaction: jest.fn((arg: unknown) => {
      if (typeof arg === 'function') {
        return (arg as (tx: typeof prismaMock) => unknown)(prismaMock);
      }
      if (Array.isArray(arg)) {
        return Promise.all(arg);
      }
      return Promise.resolve(arg);
    }),
  } as unknown as PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
