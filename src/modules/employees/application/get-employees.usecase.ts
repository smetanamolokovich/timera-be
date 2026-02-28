import { Inject, Injectable } from '@nestjs/common';
import type { EmployeeRepository } from '../domain/employee.repository';
import { REPOSITORY_TOKENS } from '../../../common/tokens';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

@Injectable()
export class GetEmployeesUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(organizationId: string, paginationQuery: PaginationQueryDto) {
    return this.employeeRepository.findByOrganizationId(
      organizationId,
      paginationQuery,
    );
  }
}
