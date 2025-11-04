import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.moudle';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
