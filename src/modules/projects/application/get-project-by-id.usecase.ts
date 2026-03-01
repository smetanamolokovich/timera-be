import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import type { ProjectRepository } from '../domain/project.repository';
import { ProjectNotFoundError } from '../domain/errors/project-not-found.error';

@Injectable()
export class GetProjectByIdUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.ProjectRepository)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(id: string) {
    const project = await this.projectRepository.findById(id);

    if (!project) {
      throw new ProjectNotFoundError();
    }

    return project;
  }
}
