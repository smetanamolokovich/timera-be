import { ProjectSummary } from './read-models/project-summary';
import type { TimeEntry } from './time-entry';

export interface TimeEntryRepository {
  save(timeEntry: TimeEntry): Promise<void>;
  findById(id: string): Promise<TimeEntry | null>;
  findByEmployeeId(employeeId: string): Promise<TimeEntry[]>;
  findByProjectId(
    projectId: string,
    fromDate?: Date,
    toDate?: Date,
  ): Promise<TimeEntry[]>;
  findByWorkTypeId(workTypeId: string): Promise<TimeEntry[]>;
  getProjectSummary(
    projectId: string,
    fromDate?: Date,
    toDate?: Date,
  ): Promise<ProjectSummary>;
}
