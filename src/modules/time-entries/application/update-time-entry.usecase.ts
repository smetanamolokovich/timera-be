import { Inject } from '@nestjs/common';
import type { TimeEntryRepository } from '../domain/time-entry.repository';
import type { EmployeeRepository } from '../../employees/domain/employee.repository';
import type { WorkTypeRepository } from '../../work-types/domain/work-type.repository';
import { TimeEntry } from '../domain/time-entry';
import { AccessDeniedError } from '../../../common/errors/access-denied.error';
import { TimeEntryNotFoundError } from '../domain/errors/time-entry-not-found.error';
import { REPOSITORY_TOKENS } from '../../../common/tokens';

interface UpdateTimeEntryParams {
  workTypeId?: string;
  description?: string;
  hours?: number;
  date?: Date;
}

export class UpdateTimeEntryUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.TimeEntryRepository)
    private readonly timeEntryRepository: TimeEntryRepository,
    @Inject(REPOSITORY_TOKENS.EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
    @Inject(REPOSITORY_TOKENS.WorkTypeRepository)
    private readonly workTypeRepository: WorkTypeRepository,
  ) {}

  async execute(
    userId: string,
    timeEntryId: string,
    params: UpdateTimeEntryParams,
  ) {
    const employee = await this.employeeRepository.findByUserId(userId);
    if (!employee) {
      throw new AccessDeniedError();
    }

    const timeEntry = await this.timeEntryRepository.findById(timeEntryId);
    if (!timeEntry) {
      throw new TimeEntryNotFoundError();
    }

    if (timeEntry.employeeId !== employee.id) {
      throw new AccessDeniedError();
    }

    const newWorkTypeId = params.workTypeId ?? timeEntry.workTypeId;

    if (params.workTypeId !== undefined) {
      const workType = await this.workTypeRepository.findByIdAndProjectId(
        params.workTypeId,
        timeEntry.projectId,
      );
      if (!workType) {
        throw new AccessDeniedError();
      }
    }

    const updated = new TimeEntry(
      timeEntry.id,
      timeEntry.projectId,
      timeEntry.employeeId,
      newWorkTypeId,
      params.description ?? timeEntry.description,
      params.hours ?? timeEntry.hours,
      params.date ?? timeEntry.date,
      timeEntry.createdAt,
    );

    await this.timeEntryRepository.save(updated);

    return updated;
  }
}
