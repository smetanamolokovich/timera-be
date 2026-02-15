import { Inject } from '@nestjs/common';
import type { ProjectRepository } from '../domain/project.repository';
import { ProjectMapper } from '../infra/project.mapper';

export class GetProjectByUserIdUseCase {
  constructor(
    @Inject('ProjectRepository')
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(userId: string) {
    const projects = await this.projectRepository.findByUserId(userId);
    return ProjectMapper.toResponseList(projects);
  }
}
