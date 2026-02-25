import { ProjectSummary } from '../domain/project-summary';

export class ReportPresentationMapper {
  static toProjectSummaryReponse(projectSummary: ProjectSummary) {
    return {
      totalHours: projectSummary.totalHours,
      totalCost: projectSummary.totalCost,
      byEmployee: projectSummary.byEmployee.map((employeeSummary) => ({
        employeeId: employeeSummary.employeeId,
        hours: employeeSummary.hours,
        cost: employeeSummary.cost,
      })),
      byWorkType: projectSummary.byWorkType.map((workTypeSummary) => ({
        workTypeId: workTypeSummary.workTypeId,
        hours: workTypeSummary.hours,
      })),
    };
  }
}
