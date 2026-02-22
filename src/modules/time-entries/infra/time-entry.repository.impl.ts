import { InjectRepository } from '@nestjs/typeorm';
import {
  SummaryParams,
  TimeEntryRepository,
} from '../domain/time-entry.repository';
import { TimeEntryOrmEntity } from './time-entry.orm-entiry';
import { Repository } from 'typeorm/repository/Repository.js';
import { TimeEntry } from '../domain/time-entry';
import { TimeEntryMapper } from './time-entry.mapper';
import {
  FindOptionsWhere,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
  SelectQueryBuilder,
} from 'typeorm';
import type { ProjectSummary } from '../domain/read-models/project-summary';

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
    fromDate?: Date,
    toDate?: Date,
  ): Promise<TimeEntry[]> {
    const where: FindOptionsWhere<TimeEntryOrmEntity> = { projectId };

    if (fromDate && toDate) {
      where.date = Between(fromDate, toDate);
    } else if (fromDate) {
      where.date = MoreThanOrEqual(fromDate);
    } else if (toDate) {
      where.date = LessThanOrEqual(toDate);
    }

    const rows = await this.repository.find({ where, order: { date: 'DESC' } });

    return rows.map((row) => TimeEntryMapper.toDomain(row));
  }

  async findByWorkTypeId(workTypeId: string): Promise<TimeEntry[]> {
    const rows = await this.repository.find({ where: { workTypeId } });

    return rows.map((row) => TimeEntryMapper.toDomain(row));
  }

  async getProjectSummary(params: SummaryParams): Promise<ProjectSummary> {
    const { totalHours, totalCost } = await this.getTotalHours(params);

    const byEmployee = await this.getByEmployeeSummary(params);

    const byWorkType = await this.getByWorkTypeSummary(params);

    return {
      totalHours,
      totalCost,
      byEmployee,
      byWorkType,
    };
  }

  private applyDateFilter(
    qb: SelectQueryBuilder<TimeEntryOrmEntity>,
    fromDate?: Date,
    toDate?: Date,
  ) {
    if (fromDate) {
      qb.andWhere('timeEntry.date >= :fromDate', { fromDate });
    }
    if (toDate) {
      qb.andWhere('timeEntry.date <= :toDate', { toDate });
    }
  }

  private async getTotalHours(params: SummaryParams) {
    const { projectId, fromDate, toDate } = params;
    const qb = this.repository
      .createQueryBuilder('timeEntry')
      .leftJoin('timeEntry.employee', 'employee')
      .select('COALESCE(SUM(timeEntry.hours), 0)', 'totalHours')
      .addSelect(
        'COALESCE(SUM(timeEntry.hours * COALESCE(employee.hourlyRate, 0)), 0)',
        'totalCost',
      )
      .where('timeEntry.projectId = :projectId', { projectId });

    this.applyDateFilter(qb, fromDate, toDate);

    const result = await qb.getRawOne<{
      totalHours: string;
      totalCost: string;
    }>();

    return {
      totalHours: Number(result?.totalHours || 0),
      totalCost: parseFloat(result?.totalCost || '0'),
    };
  }

  private async getByEmployeeSummary(params: SummaryParams) {
    const { projectId, fromDate, toDate } = params;
    const qb = this.repository
      .createQueryBuilder('timeEntry')
      .leftJoin('timeEntry.employee', 'employee')
      .select('timeEntry.employeeId', 'employeeId')
      .addSelect('COALESCE(SUM(timeEntry.hours), 0)', 'hours')
      .addSelect(
        'COALESCE(SUM(timeEntry.hours * COALESCE(employee.hourlyRate, 0)), 0)',
        'cost',
      )
      .orderBy('hours', 'DESC')
      .groupBy('timeEntry.employeeId')
      .where('timeEntry.projectId = :projectId', { projectId });

    this.applyDateFilter(qb, fromDate, toDate);

    const result = await qb.getRawMany<{
      employeeId: string;
      hours: string;
      cost: string;
    }>();

    return result.map((row) => ({
      employeeId: row.employeeId,
      hours: parseFloat(row.hours),
      cost: parseFloat(row.cost),
    }));
  }

  private async getByWorkTypeSummary(params: SummaryParams) {
    const { projectId, fromDate, toDate } = params;
    const qb = this.repository
      .createQueryBuilder('timeEntry')
      .select('timeEntry.workTypeId', 'workTypeId')
      .addSelect('COALESCE(SUM(timeEntry.hours), 0)', 'hours')
      .groupBy('timeEntry.workTypeId')
      .orderBy('hours', 'DESC')
      .where('timeEntry.projectId = :projectId', { projectId });

    this.applyDateFilter(qb, fromDate, toDate);

    const result = await qb.getRawMany<{
      workTypeId: string;
      hours: string;
    }>();

    return result.map((row) => ({
      workTypeId: row.workTypeId,
      hours: parseFloat(row.hours),
    }));
  }
}
