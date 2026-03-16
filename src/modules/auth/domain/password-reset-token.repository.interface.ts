import { PasswordResetToken } from './password-reset-token';

export interface PasswordResetTokenRepository {
  save(token: PasswordResetToken): Promise<void>;
  findByToken(token: string): Promise<PasswordResetToken | null>;
  update(token: PasswordResetToken): Promise<void>;
}
