import { InjectRepository } from '@nestjs/typeorm';
import { TimeEntryRepository } from '../domain/time-entry.repository';
import { TimeEntryOrmEntity } from './time-entry.orm-entiry';
import { Repository } from 'typeorm/repository/Repository.js';
import { TimeEntry } from '../domain/time-entry';
import { TimeEntryMapper } from './time-entry.mapper';

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

  async findByProjectId(projectId: string): Promise<TimeEntry[]> {
    const rows = await this.repository.find({ where: { projectId } });

    return rows.map((row) => TimeEntryMapper.toDomain(row));
  }

  async findByWorkTypeId(workTypeId: string): Promise<TimeEntry[]> {
    const rows = await this.repository.find({ where: { workTypeId } });

    return rows.map((row) => TimeEntryMapper.toDomain(row));
  }
}
