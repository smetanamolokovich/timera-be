import { Employee } from '../domain/employee';
import { EmployeeOrmEntity } from './employee.orm-entity';

export class EmployeeMapper {
  static fromDomain(employee: Employee): EmployeeOrmEntity {
    const orm = new EmployeeOrmEntity();
    orm.id = employee.id;
    orm.ownerUserId = employee.ownerUserId;
    orm.name = employee.name;
    orm.hourlyRate = employee.hourlyRate;
    orm.createdAt = employee.createdAt;
    return orm;
  }

  static toDomain(orm: EmployeeOrmEntity): Employee {
    return new Employee(
      orm.id,
      orm.ownerUserId,
      orm.name,
      orm.hourlyRate,
      orm.createdAt,
    );
  }

  static toResponse(employee: Employee) {
    return {
      id: employee.id,
      ownerUserId: employee.ownerUserId,
      name: employee.name,
      hourlyRate: employee.hourlyRate,
      createdAt: employee.createdAt,
    };
  }

  static toResponseList(employees: Employee[]) {
    return employees.map((employee) => this.toResponse(employee));
  }
}
