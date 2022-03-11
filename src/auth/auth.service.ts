import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from './dto/auth-response.dto';
import { LoginDto } from './dto/login-user.dto';
import { PasswordProvider } from 'src/provider/password';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from 'src/user/user.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly userService: UserService,
    private readonly passwordProvider: PasswordProvider,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { userId, password } = loginDto;

    const user = await this.prismaService.user.findUnique({
      where: { userId },
    });
    if (!user) {
      throw new NotFoundException('User not Found');
    }
    const validatePassword = await this.passwordProvider.comparePassword(
      password,
      user.password,
    );
    if (!validatePassword) {
      throw new UnauthorizedException('invalid password');
    }
    return {
      accessToken: await this.createAccessToken({ userId: user.userId }),
      refreshToken: await this.createRefreshToken({ userId: user.userId }),
      user,
    };
  }

  async register(registerUserDto: RegisterUserDto): Promise<AuthResponse> {
    const user = await this.userService.createUser(registerUserDto);
    return {
      accessToken: await this.createAccessToken({ userId: user.userId }),
      refreshToken: await this.createRefreshToken({ userId: user.userId }),
      user,
    };
  }

  async createAccessToken(payload: { userId: string }): Promise<any> {
    return this.jwtService.sign(payload);
  }
  async createRefreshToken(payload: { userId: string }): Promise<any> {
    return this.jwtService.sign(payload, {
      secret: 'jwtSecret',
      expiresIn: '14d',
    });
  }
  async validateRefreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: 'jwtSecret',
      });

      const user = await this.prismaService.user.findUnique({
        where: { userId },
      });

      return {
        accessToken: await this.createAccessToken({ userId }),
        refreshToken: await this.createRefreshToken({ userId }),
        user,
      };
    } catch (err) {
      console.log(err);
    }
  }
}
