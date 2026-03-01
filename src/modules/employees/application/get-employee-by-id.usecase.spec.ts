import { GetEmployeeByIdUseCase } from './get-employee-by-id.usecase';
import { EmployeeNotFoundError } from '../domain/errors/employee-not-found.error';
import { Employee } from '../domain/employee';
import type { EmployeeRepository } from '../domain/employee.repository';

describe('GetEmployeeByIdUseCase', () => {
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

  const useCase = new GetEmployeeByIdUseCase(mockEmployeeRepository);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the employee when found', async () => {
    const employee = new Employee(
      'emp-id',
      'org-id',
      'Jane Smith',
      50,
      new Date(),
    );
    findById.mockResolvedValue(employee);

    const result = await useCase.execute('emp-id');

    expect(result).toBe(employee);
    expect(findById).toHaveBeenCalledWith('emp-id');
  });

  it('should throw EmployeeNotFoundError when employee is not found', async () => {
    findById.mockResolvedValue(null);

    await expect(useCase.execute('nonexistent-id')).rejects.toThrow(
      EmployeeNotFoundError,
    );
    expect(findById).toHaveBeenCalledWith('nonexistent-id');
  });
});
