import { Inject } from '@nestjs/common';
import type { ProjectRepository } from '../domain/project.repository';
import { randomUUID } from 'crypto';
import { Project } from '../domain/project';
import { REPOSITORY_TOKENS } from '../../../common/tokens';

export class CreateProjectUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.ProjectRepository)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(organizationId: string, name: string) {
    const project = new Project(randomUUID(), organizationId, name, new Date());
    await this.projectRepository.save(project);

    return project;
  }
}
