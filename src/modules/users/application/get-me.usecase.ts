import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import type { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user';
import { NotFoundError } from '../../../common/errors/not-found.errors';

@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string): Promise<User> {
    const foundUser = await this.userRepository.findById(userId);

    if (!foundUser) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }

    return foundUser;
  }
}
