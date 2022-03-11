import { User } from '@prisma/client';

export class AuthResponse {
  accessToken: string;
  user: User;
}
