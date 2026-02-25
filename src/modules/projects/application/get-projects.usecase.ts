import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import type { ProjectRepository } from '../domain/project.repository';
import { Project } from '../domain/project';

@Injectable()
export class GetProjectsUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.ProjectRepository)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(organizationId: string): Promise<Project[]> {
    return this.projectRepository.findByOrganizationId(organizationId);
  }
}
