import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeOrmEntity } from './infra/employee.orm-entity';
import { CreateEmployeeUseCase } from './application/create-employee.usecase';
import { EmployeeRepositoryImpl } from './infra/employee.repository.impl';
import { EmployeeController } from './presentation/employee.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeOrmEntity])],
  providers: [
    CreateEmployeeUseCase,
    {
      provide: 'EmployeeRepository',
      useClass: EmployeeRepositoryImpl,
    },
  ],
  controllers: [EmployeeController],
})
export class EmployeesModule {}
