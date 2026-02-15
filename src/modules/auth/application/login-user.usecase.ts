import { Inject } from '@nestjs/common';
import type { UserRepository } from '../../users/domain/user.repository';
import { JwtService } from '@nestjs/jwt';
import { InvalidEmailOrPasswordError } from '../domain/errors/invalid-email-or-password.error';
import type { PasswordHasher } from '../../users/domain/password-hasher';

export class LoginUserUseCase {
  constructor(
    @Inject('UserRepository')
    private userRepository: UserRepository,
    @Inject('PasswordHasher')
    private passwordHasher: PasswordHasher,
    private jwtService: JwtService,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidEmailOrPasswordError();
    }

    const isMatch = await this.passwordHasher.compare(
      password,
      user.getPasswordHash(),
    );

    if (!isMatch) {
      throw new InvalidEmailOrPasswordError();
    }

    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
