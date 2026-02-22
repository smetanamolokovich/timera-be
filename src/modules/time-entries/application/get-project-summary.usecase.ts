import { Inject } from '@nestjs/common';
import type { EmployeeRepository } from '../../employees/domain/employee.repository';
import type { ProjectRepository } from '../../projects/domain/project.repository';
import type { TimeEntryRepository } from '../domain/time-entry.repository';
import { AccessDeniedError } from '../../../common/errors/access-denied.error';
import { REPOSITORY_TOKENS } from '../../../common/tokens';

type GetProjectSummaryParams = {
  userId: string;
  projectId: string;
  fromDate?: Date;
  toDate?: Date;
};

export class GetProjectSummaryUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.ProjectRepository)
    private readonly projectRepository: ProjectRepository,

    @Inject(REPOSITORY_TOKENS.EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,

    @Inject(REPOSITORY_TOKENS.TimeEntryRepository)
    private readonly timeEntryRepository: TimeEntryRepository,
  ) {}

  async execute(params: GetProjectSummaryParams) {
    const { userId, projectId, fromDate, toDate } = params;

    const employee = await this.employeeRepository.findByUserId(userId);
    if (!employee) throw new AccessDeniedError();

    const project = await this.projectRepository.findById(projectId);
    if (!project) throw new AccessDeniedError();

    if (project.organizationId !== employee.organizationId)
      throw new AccessDeniedError();

    return this.timeEntryRepository.getProjectSummary({
      projectId,
      fromDate,
      toDate,
    });
  }
}
