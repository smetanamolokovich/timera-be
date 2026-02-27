import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '../domain/user.repository';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import { User } from '../domain/user';
import { NotFoundError } from '../../../common/errors/not-found.errors';

interface UpdateMeParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  locale?: string;
  avatarUrl?: string;
  phone?: string;
}

@Injectable()
export class UpdateMeUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string, updateData: UpdateMeParams): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFoundError(`User with ID ${userId} not found`);

    this.updateUserFromData(user, updateData);

    await this.userRepository.update(user);

    return user;
  }

  private updateUserFromData(user: User, updateData: UpdateMeParams): User {
    if (updateData.firstName !== undefined) {
      user.firstName = updateData.firstName;
    }
    if (updateData.lastName !== undefined) {
      user.lastName = updateData.lastName;
    }
    if (updateData.email !== undefined) {
      user.email = updateData.email;
    }
    if (updateData.locale !== undefined) {
      user.locale = updateData.locale;
    }
    if (updateData.avatarUrl !== undefined) {
      user.avatarUrl = updateData.avatarUrl;
    }
    if (updateData.phone !== undefined) {
      user.phone = updateData.phone;
    }

    return user;
  }
}
