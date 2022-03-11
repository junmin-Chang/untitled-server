import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PasswordProvider } from 'src/provider/password';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [PasswordProvider, UserService, PrismaService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
