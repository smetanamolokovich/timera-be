import { Inject } from '@nestjs/common';
import type { UserRepository } from '../../users/domain/user.repository';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

export class LoginUserUseCase {
  constructor(
    @Inject('UserRepository')
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.getPasswordHash());

    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
