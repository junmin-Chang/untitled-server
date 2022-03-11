import { User } from '@prisma/client';

export class AuthResponse {
  refreshToken: string;
  accessToken: string;
  user: User;
}
