import { WorkType } from './work-type';

export interface WorkTypeRepository {
  save(workType: WorkType): Promise<void>;
  findById(id: string): Promise<WorkType | null>;
  findByIdAndProjectId(id: string, projectId: string): Promise<WorkType | null>;
  findByProjectId(projectId: string): Promise<WorkType[]>;
}
