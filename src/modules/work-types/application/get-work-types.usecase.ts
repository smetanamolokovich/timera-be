import { Inject, Injectable } from '@nestjs/common';
import type { WorkTypeRepository } from '../domain/work-type.repository';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

@Injectable()
export class GetWorkTypesUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.WorkTypeRepository)
    private readonly workTypeRepository: WorkTypeRepository,
  ) {}

  async execute(projectId: string, paginationQuery: PaginationQueryDto) {
    return this.workTypeRepository.findByProjectId(projectId, paginationQuery);
  }
}
