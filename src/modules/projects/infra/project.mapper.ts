import { Project } from '../domain/project';
import { ProjectResponseDto } from '../presentation/dto/project-response.dto';
import { ProjectOrmEntity } from './project.orm-entity';

export class ProjectMapper {
  static toDomain(raw: ProjectOrmEntity): Project {
    return new Project(raw.id, raw.userId, raw.name, raw.createdAt);
  }

  static toOrm(entity: Project): ProjectOrmEntity {
    const orm = new ProjectOrmEntity();
    orm.id = entity.id;
    orm.userId = entity.userId;
    orm.name = entity.name;
    orm.createdAt = entity.createdAt;

    return orm;
  }

  static toResponse(entity: Project): ProjectResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
    };
  }
}
