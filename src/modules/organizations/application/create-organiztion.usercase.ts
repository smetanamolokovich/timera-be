import { Inject, Injectable } from '@nestjs/common';
import type { OrganizationRepository } from '../domain/interfaces/organization.interface';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import { Organization } from '../domain/organization';
import type { UserRepository } from '../../users/domain/user.repository';
import type { MembershipRepository } from '../../memberships/domain/interfaces/membership.repository.interface';
import {
  Membership,
  OrganizationRoleEnum,
} from '../../memberships/domain/membership';
import { NotFoundError } from '../../../common/errors/not-found.errors';

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.OrganizationRepository)
    private readonly organizationRepository: OrganizationRepository,
    @Inject(REPOSITORY_TOKENS.UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(REPOSITORY_TOKENS.MembershipRepository)
    private readonly membershipRepository: MembershipRepository,
  ) {}

  async execute(
    userId: string,
    name: string,
    address?: string,
    phoneNumber?: string,
    email?: string,
    logoUrl?: string,
    isActive?: boolean,
  ): Promise<Organization> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError(`User with ID ${userId} not found`);

    const now = new Date();

    const organization = new Organization(
      crypto.randomUUID(),
      name,
      userId,
      now,
      now,
      address,
      phoneNumber,
      email,
      logoUrl,
      isActive,
    );
    await this.organizationRepository.save(organization);

    const membership = new Membership(
      crypto.randomUUID(),
      userId,
      organization.id,
      OrganizationRoleEnum.OWNER,
      now,
    );
    await this.membershipRepository.save(membership);

    return organization;
  }
}
