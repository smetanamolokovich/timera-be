import { Inject, Injectable } from '@nestjs/common';
import type { ProjectRepository } from '../domain/project.repository';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import { ProjectNotFoundError } from '../domain/errors/project-not-found.error';

interface UpdateProjectParams {
  name?: string;
}

@Injectable()
export class UpdateProjectUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.ProjectRepository)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(
    organizationId: string,
    projectId: string,
    params: UpdateProjectParams,
  ) {
    const project = await this.projectRepository.findById(projectId);

    if (!project || project.organizationId !== organizationId) {
      throw new ProjectNotFoundError();
    }

    if (params.name !== undefined) {
      project.name = params.name;
    }

    await this.projectRepository.save(project);

    return project;
  }
}
