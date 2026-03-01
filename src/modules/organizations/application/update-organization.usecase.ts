import { Inject, Injectable } from '@nestjs/common';
import type { OrganizationRepository } from '../domain/interfaces/organization.interface';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import { Organization } from '../domain/organization';
import { NotFoundError } from '../../../common/errors/not-found.errors';
import { OrganizationIdRequiredError } from '../../../common/errors/organization-id-required.error';

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.OrganizationRepository)
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute(
    organizationId: string | null,
    name?: string,
    logoUrl?: string,
    timezone?: string,
  ): Promise<Organization> {
    if (!organizationId) {
      throw new OrganizationIdRequiredError();
    }

    const existing =
      await this.organizationRepository.findById(organizationId);

    if (!existing) {
      throw new NotFoundError(
        `Organization with ID ${organizationId} not found`,
      );
    }

    const now = new Date();

    const updated = new Organization(
      existing.id,
      name ?? existing.name,
      existing.ownerId,
      now,
      existing.createdAt,
      existing.address,
      existing.phoneNumber,
      existing.email,
      logoUrl !== undefined ? logoUrl : existing.logoUrl,
      existing.isActive,
      timezone !== undefined ? timezone : existing.timezone,
    );

    await this.organizationRepository.update(updated);

    return updated;
  }
}
