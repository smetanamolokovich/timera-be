import { Inject } from '@nestjs/common';
import type { TimeEntryRepository } from '../domain/time-entry.repository';
import type { ProjectRepository } from '../../projects/domain/project.repository';
import type { EmployeeRepository } from '../../employees/domain/employee.repository';
import { AccessDeniedError } from '../../../common/errors/access-denied.error';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class GetTimeEntriesByProjectUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.TimeEntryRepository)
    private readonly timeEntryRepository: TimeEntryRepository,
    @Inject(REPOSITORY_TOKENS.ProjectRepository)
    private readonly projectRepository: ProjectRepository,
    @Inject(REPOSITORY_TOKENS.EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(
    userId: string,
    projectId: string,
    paginationQuery: PaginationQueryDto,
    fromDate?: Date,
    toDate?: Date,
  ) {
    const employee = await this.employeeRepository.findByUserId(userId);
    if (!employee) throw new AccessDeniedError();

    const project = await this.projectRepository.findById(projectId);
    if (!project) throw new AccessDeniedError();

    if (project.organizationId !== employee.organizationId)
      throw new AccessDeniedError();

    return this.timeEntryRepository.findByProjectId(
      projectId,
      paginationQuery,
      fromDate,
      toDate,
    );
  }
}
