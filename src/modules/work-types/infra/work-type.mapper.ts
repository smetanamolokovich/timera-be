import { WorkType } from '../domain/work-type';
import { WorkTypeOrmEntity } from './work-type.orm-entity';

export class WorkTypeMapper {
  static toDomain(entity: WorkTypeOrmEntity): WorkType {
    return new WorkType(
      entity.id,
      entity.projectId,
      entity.name,
      entity.createdAt,
    );
  }

  static toOrm(workType: WorkType): WorkTypeOrmEntity {
    const orm = new WorkTypeOrmEntity();
    orm.id = workType.id;
    orm.projectId = workType.projectId;
    orm.name = workType.name;
    orm.createdAt = workType.createdAt;

    return orm;
  }
}
