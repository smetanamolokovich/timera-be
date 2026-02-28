import { InjectRepository } from '@nestjs/typeorm';
import { WorkTypeRepository } from '../domain/work-type.repository';
import { Repository } from 'typeorm';
import { WorkType } from '../domain/work-type';
import { WorkTypeOrmEntity } from './work-type.orm-entity';
import { WorkTypeMapper } from './work-type.mapper';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';

export class WorkTypeRepositoryImpl implements WorkTypeRepository {
  constructor(
    @InjectRepository(WorkTypeOrmEntity)
    private readonly repository: Repository<WorkTypeOrmEntity>,
  ) {}

  async save(workType: WorkType): Promise<void> {
    const orm = WorkTypeMapper.toOrm(workType);

    await this.repository.save(orm);
  }

  async findById(id: string): Promise<WorkType | null> {
    const row = await this.repository.findOne({ where: { id } });

    if (!row) return null;

    return WorkTypeMapper.toDomain(row);
  }

  async findByIdAndProjectId(
    id: string,
    projectId: string,
  ): Promise<WorkType | null> {
    const row = await this.repository.findOne({ where: { id, projectId } });

    if (!row) return null;

    return WorkTypeMapper.toDomain(row);
  }

  async findByProjectId(
    projectId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<WorkType>> {
    const page = paginationQuery.page ?? 1;
    const limit = paginationQuery.limit ?? 20;
    const sortBy = paginationQuery.sortBy ?? 'createdAt';
    const sortOrder = paginationQuery.sortOrder ?? 'DESC';

    const [rows, total] = await this.repository.findAndCount({
      where: { projectId },
      skip: (page - 1) * limit,
      take: limit,
      order: { [sortBy]: sortOrder } as Record<string, 'ASC' | 'DESC'>,
    });

    return {
      data: rows.map((row) => WorkTypeMapper.toDomain(row)),
      meta: {
        total,
        page,
        limit,
        nextCursor: rows.length ? rows[rows.length - 1].id : null,
        hasNextPage: (page - 1) * limit + rows.length < total,
      },
    };
  }
}
