import { Inject, Injectable } from '@nestjs/common';
import type { WorkTypeRepository } from '../domain/work-type.repository';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import { WorkTypeNotFoundError } from '../domain/errors/work-type-not-found.error';

@Injectable()
export class GetWorkTypeByIdUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.WorkTypeRepository)
    private readonly workTypeRepository: WorkTypeRepository,
  ) {}

  async execute(id: string) {
    const workType = await this.workTypeRepository.findById(id);

    if (!workType) throw new WorkTypeNotFoundError();

    return workType;
  }
}
