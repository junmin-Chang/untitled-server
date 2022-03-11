import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { PasswordProvider } from '../provider/password';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private passwordProvider: PasswordProvider,
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
    delete user.password;
    return user;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const userExists = await this.prisma.user.findUnique({
      where: { userId: data.userId },
    });
    if (userExists) {
      throw new HttpException('유저가 이미 존재함.', HttpStatus.CONFLICT);
    }
    const passwordHashed = await this.passwordProvider.hashPassword(
      data.password,
    );
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: passwordHashed,
      },
    });
    delete user.password;
    return user;
  }
}
