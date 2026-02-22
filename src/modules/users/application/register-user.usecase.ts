import { randomUUID } from 'crypto';
import type { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user';
import { Inject } from '@nestjs/common';
import { EmailAlreadyExistsError } from '../domain/errors/email-already-exists.error';
import { InvalidPasswordError } from '../domain/errors/invalid-password.error';
import type { PasswordHasher } from '../domain/password-hasher';
import { REPOSITORY_TOKENS, SERVICE_TOKENS } from '../../../common/tokens';

export class RegisterUserUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.UserRepository)
    private userRepository: UserRepository,
    @Inject(SERVICE_TOKENS.PasswordHasher)
    private passwordHasher: PasswordHasher,
  ) {}

  async execute(email: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new EmailAlreadyExistsError();
    }

    if (!password || password.length < 8) {
      throw new InvalidPasswordError();
    }

    const passwordHash = await this.passwordHasher.hash(password);

    const user = new User(randomUUID(), email, passwordHash, new Date());

    await this.userRepository.save(user);

    return user;
  }
}
