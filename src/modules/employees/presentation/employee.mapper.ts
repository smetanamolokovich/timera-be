import { Employee } from '../domain/employee';
import { EmployeeResponseDto } from './dto/employee-response.dto';

export class EmployeePresentationMapper {
  static toResponse(employee: Employee): EmployeeResponseDto {
    return {
      id: employee.id,
      organizationId: employee.organizationId,
      name: employee.name,
      hourlyRate: employee.hourlyRate,
      createdAt: employee.createdAt,
    };
  }

  static toResponseList(employees: Employee[]): EmployeeResponseDto[] {
    return employees.map((employee) => this.toResponse(employee));
  }
}
