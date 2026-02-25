import { Injectable } from '@nestjs/common';
import {
  ReportRepository,
  SummaryParams,
} from '../domain/interfaces/report.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeEntryOrmEntity } from '../../time-entries/infra/time-entry.orm-entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ProjectSummary } from '../domain/project-summary';

@Injectable()
export class ReportRepositoryImpl implements ReportRepository {
  constructor(
    @InjectRepository(TimeEntryOrmEntity)
    private readonly timeEntryRepository: Repository<TimeEntryOrmEntity>,
  ) {}

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
    const qb = this.timeEntryRepository
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
    const qb = this.timeEntryRepository
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
    const qb = this.timeEntryRepository
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
