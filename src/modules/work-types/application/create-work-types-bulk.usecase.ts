import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import type { WorkTypeRepository } from '../domain/work-type.repository';
import type { ProjectRepository } from '../../projects/domain/project.repository';
import { AccessDeniedError } from '../../../common/errors/access-denied.error';
import { WorkType } from '../domain/work-type';

@Injectable()
export class CreateWorkTypesBulkUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.WorkTypeRepository)
    private readonly workTypeRepository: WorkTypeRepository,
    @Inject(REPOSITORY_TOKENS.ProjectRepository)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(
    organizationId: string,
    projectId: string,
    names: string[],
  ): Promise<WorkType[]> {
    const project = await this.projectRepository.findById(projectId);
    if (!project || project.organizationId !== organizationId) {
      throw new AccessDeniedError();
    }

    const workTypes = names.map(
      (name) => new WorkType(crypto.randomUUID(), projectId, name, new Date()),
    );

    await Promise.all(workTypes.map((wt) => this.workTypeRepository.save(wt)));

    return workTypes;
  }
}
