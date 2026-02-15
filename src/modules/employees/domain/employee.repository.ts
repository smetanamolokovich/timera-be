import { Employee } from './employee';

export interface EmployeeRepository {
  save(employee: Employee): Promise<void>;
  findById(id: string): Promise<Employee | null>;
  findByOwner(ownerUserId: string): Promise<Employee[]>;
}
