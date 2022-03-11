import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { JwtStrategy } from './jwt.strategy';
import { PasswordProvider } from 'src/provider/password';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'jwtSecret',
      signOptions: {
        expiresIn: '60s',
      },
    }),
  ],
  providers: [AuthService, PrismaService, JwtStrategy, PasswordProvider],
  controllers: [AuthController],
})
export class AuthModule {}
