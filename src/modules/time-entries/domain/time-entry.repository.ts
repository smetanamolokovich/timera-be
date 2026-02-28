import type { TimeEntry } from './time-entry';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';

export interface TimeEntryRepository {
  save(timeEntry: TimeEntry): Promise<void>;
  findById(id: string): Promise<TimeEntry | null>;
  findByEmployeeId(employeeId: string): Promise<TimeEntry[]>;
  findByProjectId(
    projectId: string,
    paginationQuery: PaginationQueryDto,
    fromDate?: Date,
    toDate?: Date,
  ): Promise<PaginatedResponseDto<TimeEntry>>;
  findByWorkTypeId(workTypeId: string): Promise<TimeEntry[]>;
}
