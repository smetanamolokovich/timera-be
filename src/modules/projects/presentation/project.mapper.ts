import { Project } from '../domain/project';
import { ProjectResponseDto } from './dto/project-response.dto';

export class ProjectPresentationMapper {
  static toResponse(entity: Project): ProjectResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
    };
  }

  static toResponseList(entities: Project[]): ProjectResponseDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
