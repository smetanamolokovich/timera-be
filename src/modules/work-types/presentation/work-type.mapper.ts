import { WorkType } from '../domain/work-type';

export interface WorkTypeResponse {
  id: string;
  projectId: string;
  name: string;
}

export class WorkTypePresentationMapper {
  static toResponse(workType: WorkType): WorkTypeResponse {
    return {
      id: workType.id,
      projectId: workType.projectId,
      name: workType.name,
    };
  }

  static toResponseList(workTypes: WorkType[]): WorkTypeResponse[] {
    return workTypes.map((workType) => this.toResponse(workType));
  }
}
