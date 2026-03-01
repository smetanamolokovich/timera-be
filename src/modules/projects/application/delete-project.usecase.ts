import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import type { ProjectRepository } from '../domain/project.repository';
import { ProjectNotFoundError } from '../domain/errors/project-not-found.error';
import { OrganizationAccessDeniedError } from '../domain/errors/organization-access-denied.error';

@Injectable()
export class DeleteProjectUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.ProjectRepository)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(projectId: string, organizationId: string): Promise<void> {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new ProjectNotFoundError();
    }

    if (project.organizationId !== organizationId) {
      throw new OrganizationAccessDeniedError();
    }

    await this.projectRepository.delete(projectId);
  }
}
