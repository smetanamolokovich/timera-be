import { UpdateTimeEntryUseCase } from './update-time-entry.usecase';
import { TimeEntry } from '../domain/time-entry';
import { TimeEntryNotFoundError } from '../domain/errors/time-entry-not-found.error';
import { AccessDeniedError } from '../../../common/errors/access-denied.error';
import type { TimeEntryRepository } from '../domain/time-entry.repository';
import type { EmployeeRepository } from '../../employees/domain/employee.repository';
import type { WorkTypeRepository } from '../../work-types/domain/work-type.repository';
import { Employee } from '../../employees/domain/employee';
import { WorkType } from '../../work-types/domain/work-type';

describe('UpdateTimeEntryUseCase', () => {
  const now = new Date('2024-01-15');
  const createdAt = new Date('2024-01-10');

  const mockEmployee = new Employee(
    'emp-id',
    'org-id',
    'John Doe',
    null,
    createdAt,
  );
  const mockTimeEntry = new TimeEntry(
    'te-id',
    'proj-id',
    'emp-id',
    'wt-id',
    'Initial description',
    4,
    now,
    createdAt,
  );

  const save = jest.fn<Promise<void>, [TimeEntry]>();
  const findById = jest.fn<Promise<TimeEntry | null>, [string]>();
  const mockTimeEntryRepository: Partial<TimeEntryRepository> = {
    save,
    findById,
  };

  const findByUserId = jest.fn<Promise<Employee | null>, [string]>();
  const mockEmployeeRepository: Partial<EmployeeRepository> = { findByUserId };

  const findByIdAndProjectId = jest.fn<
    Promise<WorkType | null>,
    [string, string]
  >();
  const mockWorkTypeRepository: Partial<WorkTypeRepository> = {
    findByIdAndProjectId,
  };

  const useCase = new UpdateTimeEntryUseCase(
    mockTimeEntryRepository as TimeEntryRepository,
    mockEmployeeRepository as EmployeeRepository,
    mockWorkTypeRepository as WorkTypeRepository,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update description and hours', async () => {
    findByUserId.mockResolvedValue(mockEmployee);
    findById.mockResolvedValue(mockTimeEntry);
    save.mockResolvedValue(undefined);

    const result = await useCase.execute('user-id', 'te-id', {
      description: 'Updated description',
      hours: 6,
    });

    expect(result.description).toBe('Updated description');
    expect(result.hours).toBe(6);
    expect(result.workTypeId).toBe('wt-id');
    expect(result.date).toBe(now);
    expect(save).toHaveBeenCalledWith(result);
  });

  it('should update workTypeId when valid work type is provided', async () => {
    const newWorkType = new WorkType('wt-new', 'proj-id', 'Design', createdAt);
    findByUserId.mockResolvedValue(mockEmployee);
    findById.mockResolvedValue(mockTimeEntry);
    findByIdAndProjectId.mockResolvedValue(newWorkType);
    save.mockResolvedValue(undefined);

    const result = await useCase.execute('user-id', 'te-id', {
      workTypeId: 'wt-new',
    });

    expect(result.workTypeId).toBe('wt-new');
    expect(findByIdAndProjectId).toHaveBeenCalledWith('wt-new', 'proj-id');
    expect(save).toHaveBeenCalledWith(result);
  });

  it('should update date', async () => {
    const newDate = new Date('2024-02-01');
    findByUserId.mockResolvedValue(mockEmployee);
    findById.mockResolvedValue(mockTimeEntry);
    save.mockResolvedValue(undefined);

    const result = await useCase.execute('user-id', 'te-id', { date: newDate });

    expect(result.date).toBe(newDate);
    expect(save).toHaveBeenCalledWith(result);
  });

  it('should preserve unchanged fields', async () => {
    findByUserId.mockResolvedValue(mockEmployee);
    findById.mockResolvedValue(mockTimeEntry);
    save.mockResolvedValue(undefined);

    const result = await useCase.execute('user-id', 'te-id', { hours: 8 });

    expect(result.id).toBe('te-id');
    expect(result.projectId).toBe('proj-id');
    expect(result.employeeId).toBe('emp-id');
    expect(result.description).toBe('Initial description');
    expect(result.hours).toBe(8);
    expect(result.createdAt).toBe(createdAt);
  });

  it('should throw AccessDeniedError when employee is not found', async () => {
    findByUserId.mockResolvedValue(null);

    await expect(
      useCase.execute('user-id', 'te-id', { description: 'Test' }),
    ).rejects.toThrow(AccessDeniedError);
    expect(save).not.toHaveBeenCalled();
  });

  it('should throw TimeEntryNotFoundError when time entry does not exist', async () => {
    findByUserId.mockResolvedValue(mockEmployee);
    findById.mockResolvedValue(null);

    await expect(
      useCase.execute('user-id', 'nonexistent-id', { description: 'Test' }),
    ).rejects.toThrow(TimeEntryNotFoundError);
    expect(save).not.toHaveBeenCalled();
  });

  it('should throw AccessDeniedError when time entry belongs to a different employee', async () => {
    const otherEntry = new TimeEntry(
      'te-id',
      'proj-id',
      'other-emp-id',
      'wt-id',
      'Some description',
      4,
      now,
      createdAt,
    );
    findByUserId.mockResolvedValue(mockEmployee);
    findById.mockResolvedValue(otherEntry);

    await expect(
      useCase.execute('user-id', 'te-id', { description: 'Test' }),
    ).rejects.toThrow(AccessDeniedError);
    expect(save).not.toHaveBeenCalled();
  });

  it('should throw AccessDeniedError when new workTypeId does not belong to the project', async () => {
    findByUserId.mockResolvedValue(mockEmployee);
    findById.mockResolvedValue(mockTimeEntry);
    findByIdAndProjectId.mockResolvedValue(null);

    await expect(
      useCase.execute('user-id', 'te-id', { workTypeId: 'invalid-wt' }),
    ).rejects.toThrow(AccessDeniedError);
    expect(save).not.toHaveBeenCalled();
  });
});
