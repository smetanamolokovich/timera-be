export interface EmployeeSummary {
  employeeId: string;
  hours: number;
  cost: number;
}

export interface WorkTypeSummary {
  workTypeId: string;
  hours: number;
}

export class ProjectSummary {
  constructor(
    public readonly totalHours: number,
    public readonly totalCost: number,
    public readonly byEmployee: EmployeeSummary[],
    public readonly byWorkType: WorkTypeSummary[],
  ) {}
}
