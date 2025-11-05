import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.moudle';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [PrismaModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
