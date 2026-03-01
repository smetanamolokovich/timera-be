import { DeleteEmployeeUseCase } from './delete-employee.usecase';
import { EmployeeNotFoundError } from '../domain/errors/employee-not-found.error';
import { Employee } from '../domain/employee';
import type { EmployeeRepository } from '../domain/employee.repository';

describe('DeleteEmployeeUseCase', () => {
  const save = jest.fn<Promise<void>, [Employee]>();
  const findById = jest.fn<Promise<Employee | null>, [string]>();
  const findByUserId = jest.fn<Promise<Employee | null>, [string]>();
  const findByOrganizationId = jest.fn();
  const deleteById = jest.fn<Promise<void>, [string]>();

  const mockEmployeeRepository: EmployeeRepository = {
    save,
    findById,
    findByUserId,
    findByOrganizationId,
    deleteById,
  };

  const useCase = new DeleteEmployeeUseCase(mockEmployeeRepository);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete the employee when found', async () => {
    const now = new Date();
    const employee = new Employee('emp-id', 'org-id', 'John Doe', 50, now);
    findById.mockResolvedValue(employee);
    deleteById.mockResolvedValue(undefined);

    await useCase.execute('emp-id');

    expect(findById).toHaveBeenCalledWith('emp-id');
    expect(deleteById).toHaveBeenCalledWith('emp-id');
  });

  it('should throw EmployeeNotFoundError when employee does not exist', async () => {
    findById.mockResolvedValue(null);

    await expect(useCase.execute('nonexistent-id')).rejects.toThrow(
      EmployeeNotFoundError,
    );
    expect(deleteById).not.toHaveBeenCalled();
  });
});
