import { InjectRepository } from '@nestjs/typeorm';
import { TimeEntryRepository } from '../domain/time-entry.repository';
import { TimeEntryOrmEntity } from './time-entry.orm-entity';
import { Repository } from 'typeorm';
import { TimeEntry } from '../domain/time-entry';
import { TimeEntryMapper } from './time-entry.mapper';
import {
  FindOptionsWhere,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';

export class TimeEntryRepositoryImpl implements TimeEntryRepository {
  constructor(
    @InjectRepository(TimeEntryOrmEntity)
    private readonly repository: Repository<TimeEntryOrmEntity>,
  ) {}

  async save(timeEntry: TimeEntry): Promise<void> {
    const orm = TimeEntryMapper.toOrm(timeEntry);

    await this.repository.save(orm);
  }

  async findById(id: string): Promise<TimeEntry | null> {
    const row = await this.repository.findOne({ where: { id } });

    if (!row) return null;

    return TimeEntryMapper.toDomain(row);
  }

  async findByEmployeeId(employeeId: string): Promise<TimeEntry[]> {
    const rows = await this.repository.find({ where: { employeeId } });

    return rows.map((row) => TimeEntryMapper.toDomain(row));
  }

  async findByProjectId(
    projectId: string,
    paginationQuery: PaginationQueryDto,
    fromDate?: Date,
    toDate?: Date,
  ): Promise<PaginatedResponseDto<TimeEntry>> {
    const page = paginationQuery.page ?? 1;
    const limit = paginationQuery.limit ?? 20;
    const where: FindOptionsWhere<TimeEntryOrmEntity> = { projectId };

    if (fromDate && toDate) {
      where.date = Between(fromDate, toDate);
    } else if (fromDate) {
      where.date = MoreThanOrEqual(fromDate);
    } else if (toDate) {
      where.date = LessThanOrEqual(toDate);
    }

    const [rows, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { date: 'DESC' },
    });

    return {
      data: rows.map((row) => TimeEntryMapper.toDomain(row)),
      meta: {
        total,
        page,
        limit,
        nextCursor: rows.length ? rows[rows.length - 1].id : null,
        hasNextPage: (page - 1) * limit + rows.length < total,
      },
    };
  }

  async findByWorkTypeId(workTypeId: string): Promise<TimeEntry[]> {
    const rows = await this.repository.find({ where: { workTypeId } });

    return rows.map((row) => TimeEntryMapper.toDomain(row));
  }
}
