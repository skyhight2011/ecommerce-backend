import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.moudle';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
