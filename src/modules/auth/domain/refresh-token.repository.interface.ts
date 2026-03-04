import { RefreshToken } from './refresh-token';

export interface RefreshTokenRepository {
  save(refreshToken: RefreshToken): Promise<void>;
  findByToken(token: string): Promise<RefreshToken | null>;
  revokeByToken(token: string, revokedAt: Date): Promise<void>;
  revokeAllByUserId(userId: string): Promise<void>;
}
