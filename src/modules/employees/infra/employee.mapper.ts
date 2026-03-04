import { Employee } from '../domain/employee';
import { EmployeeOrmEntity } from './employee.orm-entity';

export class EmployeeMapper {
  static fromDomain(employee: Employee): EmployeeOrmEntity {
    const orm = new EmployeeOrmEntity();
    orm.id = employee.id;
    orm.organizationId = employee.organizationId;
    orm.userId = employee.userId;
    orm.name = employee.name;
    orm.hourlyRate = employee.hourlyRate;
    orm.createdAt = employee.createdAt;
    return orm;
  }

  static toDomain(orm: EmployeeOrmEntity): Employee {
    return new Employee(
      orm.id,
      orm.organizationId,
      orm.userId,
      orm.name,
      orm.hourlyRate,
      orm.createdAt,
    );
  }
}
