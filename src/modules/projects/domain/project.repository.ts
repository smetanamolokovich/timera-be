import { Project } from './project';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';

export interface ProjectRepository {
  save(project: Project): Promise<void>;
  findById(id: string): Promise<Project | null>;
  findByOrganizationId(
    organizationId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<Project>>;
  delete(id: string): Promise<void>;
}
