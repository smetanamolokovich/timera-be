import { InjectRepository } from '@nestjs/typeorm';
import type { ProjectRepository } from '../domain/project.repository';
import { ProjectOrmEntity } from '../infra/project.orm-entity';
import { Project } from '../domain/project';
import { ProjectMapper } from '../infra/project.mapper';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';

export class ProjectRepositoryImpl implements ProjectRepository {
  constructor(
    @InjectRepository(ProjectOrmEntity)
    private readonly projectRepository: Repository<ProjectOrmEntity>,
  ) {}

  async save(project: Project): Promise<void> {
    const orm = ProjectMapper.toOrm(project);
    await this.projectRepository.save(orm);
  }

  async findById(id: string): Promise<Project | null> {
    const row = await this.projectRepository.findOne({ where: { id } });

    if (!row) return null;

    return ProjectMapper.toDomain(row);
  }

  async delete(id: string): Promise<void> {
    await this.projectRepository.delete(id);
  }

  async findByOrganizationId(
    organizationId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<Project>> {
    const page = paginationQuery.page ?? 1;
    const limit = paginationQuery.limit ?? 20;
    const sortBy = paginationQuery.sortBy ?? 'createdAt';
    const sortOrder = paginationQuery.sortOrder ?? 'DESC';

    const [rows, total] = await this.projectRepository.findAndCount({
      where: { organizationId },
      skip: (page - 1) * limit,
      take: limit,
      order: { [sortBy]: sortOrder } as Record<string, 'ASC' | 'DESC'>,
    });

    return {
      data: rows.map((row) => ProjectMapper.toDomain(row)),
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
