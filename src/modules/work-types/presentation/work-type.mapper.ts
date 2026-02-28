import { WorkType } from '../domain/work-type';
import { WorkTypeResponseDto } from './dto/work-type-response.dto';

export class WorkTypePresentationMapper {
  static toResponse(workType: WorkType): WorkTypeResponseDto {
    return {
      id: workType.id,
      projectId: workType.projectId,
      name: workType.name,
    };
  }

  static toResponseList(workTypes: WorkType[]): WorkTypeResponseDto[] {
    return workTypes.map((workType) => this.toResponse(workType));
  }
}
