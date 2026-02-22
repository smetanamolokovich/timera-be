import { TimeEntry } from '../domain/time-entry';
import { TimeEntryResponseDto } from './dto/time-entry-response.dto';

export class TimeEntryPresentationMapper {
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
