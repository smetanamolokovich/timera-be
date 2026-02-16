import { TimeEntry } from './time-entry';

export interface TimeEntryRepository {
  save(timeEntry: TimeEntry): Promise<void>;
  findById(id: string): Promise<TimeEntry | null>;
  findByEmployeeId(employeeId: string): Promise<TimeEntry[]>;
  findByProjectId(projectId: string): Promise<TimeEntry[]>;
  findByWorkTypeId(workTypeId: string): Promise<TimeEntry[]>;
}
