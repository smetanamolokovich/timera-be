import { Inject } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import type { TimeEntryRepository } from '../domain/time-entry.repository';
import type { EmployeeRepository } from '../../employees/domain/employee.repository';
import { TimeEntryNotFoundError } from '../domain/errors/time-entry-not-found.error';
import { AccessDeniedError } from '../../../common/errors/access-denied.error';

export class DeleteTimeEntryUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.TimeEntryRepository)
    private readonly timeEntryRepository: TimeEntryRepository,
    @Inject(REPOSITORY_TOKENS.EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(userId: string, timeEntryId: string): Promise<void> {
    const timeEntry = await this.timeEntryRepository.findById(timeEntryId);

    if (!timeEntry) {
      throw new TimeEntryNotFoundError();
    }

    const employee = await this.employeeRepository.findByUserId(userId);

    if (!employee || employee.id !== timeEntry.employeeId) {
      throw new AccessDeniedError();
    }

    await this.timeEntryRepository.delete(timeEntryId);
  }
}
