import { Project } from '../domain/project';
import { ProjectOrmEntity } from './project.orm-entity';

export class ProjectMapper {
  static toDomain(raw: ProjectOrmEntity): Project {
    return new Project(raw.id, raw.organizationId, raw.name, raw.createdAt);
  }

  static toOrm(entity: Project): ProjectOrmEntity {
    const orm = new ProjectOrmEntity();
    orm.id = entity.id;
    orm.organizationId = entity.organizationId;
    orm.name = entity.name;
    orm.createdAt = entity.createdAt;

    return orm;
  }
}
