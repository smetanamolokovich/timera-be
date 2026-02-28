import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import type { ProjectRepository } from '../domain/project.repository';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

@Injectable()
export class GetProjectsUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.ProjectRepository)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(organizationId: string, paginationQuery: PaginationQueryDto) {
    return this.projectRepository.findByOrganizationId(
      organizationId,
      paginationQuery,
    );
  }
}
