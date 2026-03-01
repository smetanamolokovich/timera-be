import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { Employee } from './employee';

export interface EmployeeRepository {
  save(employee: Employee): Promise<void>;
  findById(id: string): Promise<Employee | null>;
  findByUserId(userId: string): Promise<Employee | null>;
  findByOrganizationId(
    organizationId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<Employee>>;
  deleteById(id: string): Promise<void>;
}
