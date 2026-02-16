import { Employee } from './employee';

export interface EmployeeRepository {
  save(employee: Employee): Promise<void>;
  findById(id: string): Promise<Employee | null>;
  findByUserId(userId: string): Promise<Employee | null>;
}
