import { Inject } from '@nestjs/common';
import type { TimeEntryRepository } from '../domain/time-entry.repository';
import type { ProjectRepository } from '../../projects/domain/project.repository';
import type { EmployeeRepository } from '../../employees/domain/employee.repository';
import type { WorkTypeRepository } from '../../work-types/domain/work-type.repository';
import { randomUUID } from 'crypto';
import { TimeEntry } from '../domain/time-entry';
import { AccessDeniedError } from '../../../common/errors/access-denied.error';

export class CreateTimeEntryUseCase {
  constructor(
    @Inject('TimeEntryRepository')
    private readonly timeEntryRepository: TimeEntryRepository,
    @Inject('EmployeeRepository')
    private readonly employeeRepository: EmployeeRepository,
    @Inject('ProjectRepository')
    private readonly projectRepository: ProjectRepository,
    @Inject('WorkTypeRepository')
    private readonly workTypeRepository: WorkTypeRepository,
  ) {}

  async execute(
    userId: string,
    projectId: string,
    workTypeId: string,
    description: string,
    hours: number,
    date: Date,
  ) {
    const employee = await this.employeeRepository.findByUserId(userId);
    if (!employee) {
      throw new AccessDeniedError();
    }

    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new AccessDeniedError();
    }

    if (project.organizationId !== employee.organizationId) {
      throw new AccessDeniedError();
    }

    const workType = await this.workTypeRepository.findById(workTypeId);
    if (!workType) {
      throw new AccessDeniedError();
    }

    if (workType.projectId !== project.id) {
      throw new AccessDeniedError();
    }

    // TODO: can be workTypeRepository.findByIdAndProjectId(workTypeId, projectId)

    const timeEntry = new TimeEntry(
      randomUUID(),
      projectId,
      employee.id,
      workTypeId,
      description,
      hours,
      date,
      new Date(),
    );

    await this.timeEntryRepository.save(timeEntry);

    return timeEntry;
  }
}
