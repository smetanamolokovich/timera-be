import { randomUUID } from 'crypto';
import type { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user';
import bcrypt from 'bcrypt';
import { Inject } from '@nestjs/common';

export class RegisterUserUseCase {
  constructor(
    @Inject('UserRepository')
    private userRepository: UserRepository,
  ) {}

  async execute(email: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error('Email is already in use');
    }

    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    if (isNaN(saltRounds)) {
      throw new Error('Invalid BCRYPT_SALT_ROUNDS configuration');
    }

    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User(randomUUID(), email, passwordHash, new Date());

    await this.userRepository.save(user);

    return user;
  }
}
