import { Inject, Injectable } from '@nestjs/common';
import type { EmployeeRepository } from '../domain/employee.repository';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import { EmployeeNotFoundError } from '../domain/errors/employee-not-found.error';

@Injectable()
export class GetEmployeeByIdUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(id: string) {
    const employee = await this.employeeRepository.findById(id);

    if (!employee) {
      throw new EmployeeNotFoundError();
    }

    return employee;
  }
}
