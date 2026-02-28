import { Repository } from 'typeorm';
import { EmployeeRepository } from '../domain/employee.repository';
import { EmployeeOrmEntity } from './employee.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../domain/employee';
import { EmployeeMapper } from './employee.mapper';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class EmployeeRepositoryImpl implements EmployeeRepository {
  constructor(
    @InjectRepository(EmployeeOrmEntity)
    private readonly repo: Repository<EmployeeOrmEntity>,
  ) {}

  async save(employee: Employee): Promise<void> {
    const orm = EmployeeMapper.fromDomain(employee);
    await this.repo.save(orm);
  }

  async findById(id: string): Promise<Employee | null> {
    const row = await this.repo.findOne({ where: { id } });

    if (!row) return null;

    return EmployeeMapper.toDomain(row);
  }

  async findByUserId(userId: string): Promise<Employee | null> {
    const row = await this.repo.findOne({ where: { userId } });

    if (!row) return null;

    return EmployeeMapper.toDomain(row);
  }

  async findByOrganizationId(
    organizationId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<Employee>> {
    const page = paginationQuery.page ?? 1;
    const limit = paginationQuery.limit ?? 20;

    const [rows, total] = await this.repo.findAndCount({
      where: { organizationId },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: rows.map((row) => EmployeeMapper.toDomain(row)),
      meta: {
        total,
        page,
        limit,
        nextCursor: rows.length ? rows[rows.length - 1].id : null,
        hasNextPage: rows.length === limit,
      },
    };
  }
}
