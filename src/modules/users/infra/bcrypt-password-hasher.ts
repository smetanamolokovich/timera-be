import bcrypt from 'bcrypt';
import { PasswordHasher } from '../domain/password-hasher';

export class BcryptPasswordHasher implements PasswordHasher {
  private readonly saltRounds = parseInt(
    process.env.BCRYPT_SALT_ROUNDS || '10',
    10,
  );

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
