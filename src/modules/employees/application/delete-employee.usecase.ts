import { Inject } from '@nestjs/common';
import type { EmployeeRepository } from '../domain/employee.repository';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import { EmployeeNotFoundError } from '../domain/errors/employee-not-found.error';

export class DeleteEmployeeUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const employee = await this.employeeRepository.findById(id);

    if (!employee) {
      throw new EmployeeNotFoundError();
    }

    await this.employeeRepository.deleteById(id);
  }
}
