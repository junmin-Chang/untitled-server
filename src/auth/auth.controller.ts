import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import AuthUser from 'src/common/decorators/auth-user.decorator';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth-response.dto';
import { LoginDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Post('/register')
  register(@Body() registerUserDto: RegisterUserDto): Promise<AuthResponse> {
    return this.authService.register(registerUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  getLoggedUser(@AuthUser() user: User): User {
    delete user.password;
    return user;
  }

  @Post('/refresh')
  async getToken(@Body() { token }: { token: string }) {
    return await this.authService.validateRefreshToken(token);
  }
}
