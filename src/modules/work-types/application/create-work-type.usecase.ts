import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import type { WorkTypeRepository } from '../domain/work-type.repository';
import type { ProjectRepository } from '../../projects/domain/project.repository';
import { AccessDeniedError } from '../../../common/errors/access-denied.error';
import { WorkType } from '../domain/work-type';

@Injectable()
export class CreateWorkTypeUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.WorkTypeRepository)
    private readonly workTypeRepository: WorkTypeRepository,
    @Inject(REPOSITORY_TOKENS.ProjectRepository)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(organizationId: string, projectId: string, name: string) {
    const project = await this.projectRepository.findById(projectId);
    if (!project || project.organizationId !== organizationId) {
      throw new AccessDeniedError();
    }

    const workType = new WorkType(
      crypto.randomUUID(),
      projectId,
      name,
      new Date(),
    );

    await this.workTypeRepository.save(workType);

    return workType;
  }
}
