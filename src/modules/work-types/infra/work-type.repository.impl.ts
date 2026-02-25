import { InjectRepository } from '@nestjs/typeorm';
import { WorkTypeRepository } from '../domain/work-type.repository';
import { Repository } from 'typeorm';
import { WorkType } from '../domain/work-type';
import { WorkTypeOrmEntity } from './work-type.orm-entity';
import { WorkTypeMapper } from './work-type.mapper';

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

  async findByProjectId(projectId: string): Promise<WorkType[]> {
    const rows = await this.repository.find({ where: { projectId } });

    return rows.map((row) => WorkTypeMapper.toDomain(row));
  }
}
