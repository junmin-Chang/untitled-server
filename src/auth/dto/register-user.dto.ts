import { IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  userName: string;

  @IsString()
  userId: string;

  @IsString()
  password: string;
}
