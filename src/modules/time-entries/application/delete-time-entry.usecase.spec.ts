import { DeleteTimeEntryUseCase } from './delete-time-entry.usecase';
import { TimeEntryNotFoundError } from '../domain/errors/time-entry-not-found.error';
import { AccessDeniedError } from '../../../common/errors/access-denied.error';
import { TimeEntry } from '../domain/time-entry';
import type { TimeEntryRepository } from '../domain/time-entry.repository';
import type { EmployeeRepository } from '../../employees/domain/employee.repository';
import { Employee } from '../../employees/domain/employee';

describe('DeleteTimeEntryUseCase', () => {
  const findTimeEntryById = jest.fn<Promise<TimeEntry | null>, [string]>();
  const deleteTimeEntry = jest.fn<Promise<void>, [string]>();

  const mockTimeEntryRepository: Partial<TimeEntryRepository> = {
    findById: findTimeEntryById,
    delete: deleteTimeEntry,
  };

  const findEmployeeByUserId = jest.fn<Promise<Employee | null>, [string]>();

  const mockEmployeeRepository: Partial<EmployeeRepository> = {
    findByUserId: findEmployeeByUserId,
  };

  const useCase = new DeleteTimeEntryUseCase(
    mockTimeEntryRepository as TimeEntryRepository,
    mockEmployeeRepository as EmployeeRepository,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete the time entry when it exists and belongs to the employee', async () => {
    const timeEntry = new TimeEntry(
      'entry-id',
      'project-id',
      'employee-id',
      'worktype-id',
      'Valid description',
      8,
      new Date(),
      new Date(),
    );
    const employee = new Employee('employee-id', 'org-id', 'John Doe', null, new Date());

    findTimeEntryById.mockResolvedValue(timeEntry);
    findEmployeeByUserId.mockResolvedValue(employee);
    deleteTimeEntry.mockResolvedValue(undefined);

    await useCase.execute('user-id', 'entry-id');

    expect(findTimeEntryById).toHaveBeenCalledWith('entry-id');
    expect(findEmployeeByUserId).toHaveBeenCalledWith('user-id');
    expect(deleteTimeEntry).toHaveBeenCalledWith('entry-id');
  });

  it('should throw TimeEntryNotFoundError when the time entry does not exist', async () => {
    findTimeEntryById.mockResolvedValue(null);

    await expect(useCase.execute('user-id', 'nonexistent-id')).rejects.toThrow(
      TimeEntryNotFoundError,
    );
    expect(deleteTimeEntry).not.toHaveBeenCalled();
  });

  it('should throw AccessDeniedError when the employee is not found', async () => {
    const timeEntry = new TimeEntry(
      'entry-id',
      'project-id',
      'employee-id',
      'worktype-id',
      'Valid description',
      8,
      new Date(),
      new Date(),
    );

    findTimeEntryById.mockResolvedValue(timeEntry);
    findEmployeeByUserId.mockResolvedValue(null);

    await expect(useCase.execute('user-id', 'entry-id')).rejects.toThrow(
      AccessDeniedError,
    );
    expect(deleteTimeEntry).not.toHaveBeenCalled();
  });

  it('should throw AccessDeniedError when the time entry belongs to a different employee', async () => {
    const timeEntry = new TimeEntry(
      'entry-id',
      'project-id',
      'other-employee-id',
      'worktype-id',
      'Valid description',
      8,
      new Date(),
      new Date(),
    );
    const employee = new Employee('employee-id', 'org-id', 'John Doe', null, new Date());

    findTimeEntryById.mockResolvedValue(timeEntry);
    findEmployeeByUserId.mockResolvedValue(employee);

    await expect(useCase.execute('user-id', 'entry-id')).rejects.toThrow(
      AccessDeniedError,
    );
    expect(deleteTimeEntry).not.toHaveBeenCalled();
  });
});
