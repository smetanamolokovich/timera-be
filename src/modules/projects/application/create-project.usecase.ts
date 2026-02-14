import { Inject } from '@nestjs/common';
import type { ProjectRepository } from '../domain/project.repository';
import { randomUUID } from 'crypto';
import { Project } from '../domain/project';
import { ProjectMapper } from '../infra/project.mapper';

export class CreateProjectUseCase {
  constructor(
    @Inject('ProjectRepository')
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(userId: string, name: string) {
    const project = new Project(randomUUID(), userId, name, new Date());
    await this.projectRepository.save(project);

    return ProjectMapper.toResponse(project);
  }
}
