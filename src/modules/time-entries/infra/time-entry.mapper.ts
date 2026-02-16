import { TimeEntry } from '../domain/time-entry';
import { TimeEntryResponseDto } from '../presentation/dto/time-entry-response.dto';
import { TimeEntryOrmEntity } from './time-entry.orm-entiry';

export class TimeEntryMapper {
  static toDomain(raw: TimeEntryOrmEntity): TimeEntry {
    return new TimeEntry(
      raw.id,
      raw.projectId,
      raw.employeeId,
      raw.workTypeId,
      raw.description,
      raw.hours,
      raw.date,
      raw.createdAt,
    );
  }

  static toOrm(entity: TimeEntry): TimeEntryOrmEntity {
    const orm = new TimeEntryOrmEntity();
    orm.id = entity.id;
    orm.projectId = entity.projectId;
    orm.employeeId = entity.employeeId;
    orm.workTypeId = entity.workTypeId;
    orm.description = entity.description;
    orm.hours = entity.hours;
    orm.date = entity.date;
    orm.createdAt = entity.createdAt;

    return orm;
  }

  static toResponse(entity: TimeEntry): TimeEntryResponseDto {
    return {
      id: entity.id,
      projectId: entity.projectId,
      employeeId: entity.employeeId,
      workTypeId: entity.workTypeId,
      description: entity.description,
      hours: entity.hours,
      date: entity.date,
      createdAt: entity.createdAt,
    };
  }

  static toResponseList(entities: TimeEntry[]): TimeEntryResponseDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
