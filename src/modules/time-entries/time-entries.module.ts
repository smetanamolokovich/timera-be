import { Module } from '@nestjs/common';
import { EmployeesModule } from '../employees/employees.module';
import { ProjectModule } from '../projects/project.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeEntryOrmEntity } from './infra/time-entry.orm-entiry';
import { TimeEntryRepositoryImpl } from './infra/time-entry.repository.impl';
import { CreateTimeEntryUseCase } from './application/create-time-entry.usecase';
import { WorkTypesModule } from '../work-types/work-types.module';

@Module({
  imports: [
    EmployeesModule,
    ProjectModule,
    WorkTypesModule,
    TypeOrmModule.forFeature([TimeEntryOrmEntity]),
  ],
  controllers: [],
  providers: [
    CreateTimeEntryUseCase,
    {
      provide: 'TimeEntryRepository',
      useClass: TimeEntryRepositoryImpl,
    },
  ],
})
export class TimeEntriesModule {}
