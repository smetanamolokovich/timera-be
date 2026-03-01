import { UpdateEmployeeUseCase } from './update-employee.usecase';
import { Employee } from '../domain/employee';
import { EmployeeNotFoundError } from '../domain/errors/employee-not-found.error';
import { AccessDeniedError } from '../../../common/errors/access-denied.error';
import type { EmployeeRepository } from '../domain/employee.repository';

describe('UpdateEmployeeUseCase', () => {
  const save = jest.fn<Promise<void>, [Employee]>();
  const findById = jest.fn<Promise<Employee | null>, [string]>();
  const findByUserId = jest.fn<Promise<Employee | null>, [string]>();
  const findByOrganizationId = jest.fn();

  const mockEmployeeRepository: EmployeeRepository = {
    save,
    findById,
    findByUserId,
    findByOrganizationId,
  };

  const useCase = new UpdateEmployeeUseCase(mockEmployeeRepository);

  const now = new Date();
  const existingEmployee = new Employee(
    'emp-id',
    'org-id',
    'Old Name',
    20,
    now,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update the employee name and hourlyRate', async () => {
    findById.mockResolvedValue(existingEmployee);
    save.mockResolvedValue(undefined);

    const result = await useCase.execute('org-id', 'emp-id', 'New Name', 30);

    expect(findById).toHaveBeenCalledWith('emp-id');
    expect(save).toHaveBeenCalledTimes(1);
    expect(result.name).toBe('New Name');
    expect(result.hourlyRate).toBe(30);
    expect(result.id).toBe('emp-id');
    expect(result.organizationId).toBe('org-id');
  });

  it('should keep existing values when fields are not provided', async () => {
    findById.mockResolvedValue(existingEmployee);
    save.mockResolvedValue(undefined);

    const result = await useCase.execute('org-id', 'emp-id');

    expect(result.name).toBe('Old Name');
    expect(result.hourlyRate).toBe(20);
  });

  it('should throw EmployeeNotFoundError when employee does not exist', async () => {
    findById.mockResolvedValue(null);

    await expect(useCase.execute('org-id', 'emp-id')).rejects.toThrow(
      EmployeeNotFoundError,
    );
    expect(save).not.toHaveBeenCalled();
  });

  it('should throw AccessDeniedError when employee belongs to a different organization', async () => {
    findById.mockResolvedValue(existingEmployee);

    await expect(
      useCase.execute('other-org-id', 'emp-id', 'New Name'),
    ).rejects.toThrow(AccessDeniedError);
    expect(save).not.toHaveBeenCalled();
  });
});
