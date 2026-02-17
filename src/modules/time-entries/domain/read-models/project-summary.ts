export type ProjectSummary = {
  totalHours: number;
  totalCost: number;
  byEmployee: {
    employeeId: string;
    hours: number;
    cost: number;
  }[];
  byWorkType: {
    workTypeId: string;
    hours: number;
  }[];
};
