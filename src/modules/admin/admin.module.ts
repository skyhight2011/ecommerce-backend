import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.moudle';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { AdminUserController } from './controllers/admin-user.controller';
import { AdminProductController } from './controllers/admin-product.controller';
import { AdminOrderController } from './controllers/admin-order.controller';
import { AdminOrderService } from './services/admin-order.service';

@Module({
  imports: [PrismaModule, UserModule, ProductModule],
  controllers: [
    AdminUserController,
    AdminProductController,
    AdminOrderController,
  ],
  providers: [AdminOrderService],
})
export class AdminModule {}
