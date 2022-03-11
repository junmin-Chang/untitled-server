import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async signupUser(
    @Body() userData: { userName: string; userId: string; password: string },
  ): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Get(':id')
  async profile(@Param('id') userId: string): Promise<User> {
    return this.userService.user({ userId });
  }
}
