import { Project } from './project';

export interface ProjectRepository {
  save(project: Project): Promise<void>;
  findById(id: string): Promise<Project | null>;
  findByOrganizationId(organizationId: string): Promise<Project[]>;
}
