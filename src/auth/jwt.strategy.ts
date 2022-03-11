import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'jwtSecret',
    });
  }
  async validate(payload: { userId: string }): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        userId: payload.userId,
      },
    });
    return user;
  }
}
