import { ProjectSummary } from '../project-summary';

export interface SummaryParams {
  projectId: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface ReportRepository {
  getProjectSummary(params: SummaryParams): Promise<ProjectSummary>;
}
