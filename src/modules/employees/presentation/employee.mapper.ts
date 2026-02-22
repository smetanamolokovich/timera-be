import { Employee } from '../domain/employee';

export class EmployeePresentationMapper {
  static toResponse(employee: Employee) {
    return {
      id: employee.id,
      organizationId: employee.organizationId,
      name: employee.name,
      hourlyRate: employee.hourlyRate,
      createdAt: employee.createdAt,
    };
  }

  static toResponseList(employees: Employee[]) {
    return employees.map((employee) => this.toResponse(employee));
  }
}
