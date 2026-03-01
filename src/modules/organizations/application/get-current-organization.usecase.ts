import { Inject, Injectable } from '@nestjs/common';
import type { OrganizationRepository } from '../domain/interfaces/organization.interface';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import { Organization } from '../domain/organization';
import { NotFoundError } from '../../../common/errors/not-found.errors';
import { OrganizationIdRequiredError } from '../../../common/errors/organization-id-required.error';

@Injectable()
export class GetCurrentOrganizationUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.OrganizationRepository)
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute(organizationId: string | null): Promise<Organization> {
    if (!organizationId) {
      throw new OrganizationIdRequiredError();
    }

    const organization =
      await this.organizationRepository.findById(organizationId);

    if (!organization) {
      throw new NotFoundError(
        `Organization with ID ${organizationId} not found`,
      );
    }

    return organization;
  }
}
