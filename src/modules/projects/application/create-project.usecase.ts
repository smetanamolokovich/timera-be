import { Inject } from '@nestjs/common';
import type { ProjectRepository } from '../domain/project.repository';
import { randomUUID } from 'crypto';
import { Project } from '../domain/project';
import type { EmployeeRepository } from '../../employees/domain/employee.repository';
import { REPOSITORY_TOKENS } from '../../../common/tokens';

export class CreateProjectUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.ProjectRepository)
    private readonly projectRepository: ProjectRepository,
    @Inject(REPOSITORY_TOKENS.EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(organizationId: string, name: string) {
    // TODO: check if employee has permissions to create projects in the organization

    const project = new Project(randomUUID(), organizationId, name, new Date());
    await this.projectRepository.save(project);

    return project;
  }
}
