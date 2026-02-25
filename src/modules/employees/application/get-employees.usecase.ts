import { Inject, Injectable } from '@nestjs/common';
import type { EmployeeRepository } from '../domain/employee.repository';
import { REPOSITORY_TOKENS } from '../../../common/tokens';

@Injectable()
export class GetEmployeesUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(organizationId: string) {
    return await this.employeeRepository.findByOrganizationId(organizationId);
  }
}
