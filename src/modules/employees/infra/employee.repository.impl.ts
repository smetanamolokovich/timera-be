import { Repository } from 'typeorm';
import { EmployeeRepository } from '../domain/employee.repository';
import { EmployeeOrmEntity } from './employee.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../domain/employee';
import { EmployeeMapper } from './employee.mapper';

export class EmployeeRepositoryImpl implements EmployeeRepository {
  constructor(
    @InjectRepository(EmployeeOrmEntity)
    private readonly repo: Repository<EmployeeOrmEntity>,
  ) {}

  async save(employee: Employee): Promise<void> {
    const orm = EmployeeMapper.fromDomain(employee);
    await this.repo.save(orm);
  }

  async findById(id: string): Promise<Employee | null> {
    const row = await this.repo.findOne({ where: { id } });

    if (!row) return null;

    return EmployeeMapper.toDomain(row);
  }

  async findByOwner(ownerUserId: string): Promise<Employee[]> {
    const rows = await this.repo.find({ where: { ownerUserId } });
    return rows.map((row) => EmployeeMapper.toDomain(row));
  }
}
