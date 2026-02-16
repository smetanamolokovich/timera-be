import { WorkType } from './work-type';

export interface WorkTypeRepository {
  save(workType: WorkType): Promise<void>;
  findById(id: string): Promise<WorkType | null>;
}
