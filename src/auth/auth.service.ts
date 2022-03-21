import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      throw new HttpException(
        '존재하지 않는 유저 입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const validatePassword = await this.passwordProvider.comparePassword(
      password,
      user.password,
    );
    if (!validatePassword) {
      throw new HttpException('비밀번호가 틀립니다.', HttpStatus.UNAUTHORIZED);
    }
    delete user.password;
    return {
      accessToken: await this.createAccessToken({ userId: user.userId }),
      refreshToken: await this.createRefreshToken({ userId: user.userId }),
      user,
    };
  }

  async register(registerUserDto: RegisterUserDto): Promise<AuthResponse> {
    const user = await this.userService.createUser(registerUserDto);
    delete user.password;
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
      delete user.password;
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
