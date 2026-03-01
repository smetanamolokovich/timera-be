import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeOrmEntity } from './infra/employee.orm-entity';
import { CreateEmployeeUseCase } from './application/create-employee.usecase';
import { UpdateEmployeeUseCase } from './application/update-employee.usecase';
import { EmployeeRepositoryImpl } from './infra/employee.repository.impl';
import { EmployeeController } from './presentation/employee.controller';
import { REPOSITORY_TOKENS } from '../../common/tokens';
import { GetEmployeesUseCase } from './application/get-employees.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeOrmEntity])],
  providers: [
    CreateEmployeeUseCase,
    GetEmployeesUseCase,
    UpdateEmployeeUseCase,
    {
      provide: REPOSITORY_TOKENS.EmployeeRepository,
      useClass: EmployeeRepositoryImpl,
    },
  ],
  controllers: [EmployeeController],
  exports: [REPOSITORY_TOKENS.EmployeeRepository],
})
export class EmployeesModule {}
