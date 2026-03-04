import { RefreshToken } from './refresh-token';

export interface RefreshTokenRepository {
  save(refreshToken: RefreshToken): Promise<void>;
  findByToken(token: string): Promise<RefreshToken | null>;
  revokeByToken(token: string): Promise<void>;
  revokeAllByUserId(userId: string): Promise<void>;
}
