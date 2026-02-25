import { Inject } from '@nestjs/common';
import type { EmployeeRepository } from '../domain/employee.repository';
import { randomUUID } from 'crypto';
import { Employee } from '../domain/employee';
import { REPOSITORY_TOKENS } from '../../../common/tokens';

export class CreateEmployeeUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(
    organizationId: string,
    name: string,
    hourlyRate?: number,
  ): Promise<Employee> {
    const employee = new Employee(
      randomUUID(),
      organizationId,
      name,
      hourlyRate ?? null,
      new Date(),
    );
    await this.employeeRepository.save(employee);

    return employee;
  }
}
