import { Inject } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import { AccessDeniedError } from '../../../common/errors/access-denied.error';
import type { ReportRepository } from '../domain/interfaces/report.repository.interface';
import type { EmployeeRepository } from '../../employees/domain/employee.repository';
import type { ProjectRepository } from '../../projects/domain/project.repository';

interface GetProjectSummaryParams {
  userId: string;
  projectId: string;
  fromDate?: Date;
  toDate?: Date;
}

export class GetProjectReportUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.ReportRepository)
    private readonly reportRepository: ReportRepository,
    @Inject(REPOSITORY_TOKENS.ProjectRepository)
    private readonly projectRepository: ProjectRepository,
    @Inject(REPOSITORY_TOKENS.EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(params: GetProjectSummaryParams) {
    const { userId, projectId } = params;

    const employee = await this.employeeRepository.findByUserId(userId);
    if (!employee) throw new AccessDeniedError();

    const project = await this.projectRepository.findById(projectId);
    if (!project) throw new AccessDeniedError();

    if (project.organizationId !== employee.organizationId)
      throw new AccessDeniedError();

    return this.reportRepository.getProjectSummary(params);
  }
}
