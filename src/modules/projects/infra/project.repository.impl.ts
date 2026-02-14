import { InjectRepository } from '@nestjs/typeorm';
import type { ProjectRepository } from '../domain/project.repository';
import { ProjectOrmEntity } from '../infra/project.orm-entity';
import { Project } from '../domain/project';
import { ProjectMapper } from '../infra/project.mapper';
import { Repository } from 'typeorm';

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

  async findByUserId(userId: string): Promise<Project[]> {
    const rows = await this.projectRepository.find({ where: { userId } });

    return rows.map((row) => ProjectMapper.toDomain(row));
  }
}
