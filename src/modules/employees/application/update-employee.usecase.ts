import { Inject } from '@nestjs/common';
import type { EmployeeRepository } from '../domain/employee.repository';
import { Employee } from '../domain/employee';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import { EmployeeNotFoundError } from '../domain/errors/employee-not-found.error';
import { AccessDeniedError } from '../../../common/errors/access-denied.error';

export class UpdateEmployeeUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(
    organizationId: string,
    employeeId: string,
    name?: string,
    hourlyRate?: number,
  ): Promise<Employee> {
    const existing = await this.employeeRepository.findById(employeeId);

    if (!existing) {
      throw new EmployeeNotFoundError();
    }

    if (existing.organizationId !== organizationId) {
      throw new AccessDeniedError();
    }

    const updated = new Employee(
      existing.id,
      existing.organizationId,
      name ?? existing.name,
      hourlyRate !== undefined ? hourlyRate : existing.hourlyRate,
      existing.createdAt,
    );

    await this.employeeRepository.save(updated);

    return updated;
  }
}
