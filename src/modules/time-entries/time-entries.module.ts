import { Module } from '@nestjs/common';
import { EmployeesModule } from '../employees/employees.module';
import { ProjectModule } from '../projects/project.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeEntryOrmEntity } from './infra/time-entry.orm-entiry';
import { TimeEntryRepositoryImpl } from './infra/time-entry.repository.impl';
import { CreateTimeEntryUseCase } from './application/create-time-entry.usecase';
import { WorkTypesModule } from '../work-types/work-types.module';
import { GetProjectSummaryUseCase } from './application/get-project-summary.usecase';
import { REPOSITORY_TOKENS } from '../../common/tokens';

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
    GetProjectSummaryUseCase,
    {
      provide: REPOSITORY_TOKENS.TimeEntryRepository,
      useClass: TimeEntryRepositoryImpl,
    },
  ],
  exports: [REPOSITORY_TOKENS.TimeEntryRepository, GetProjectSummaryUseCase],
})
export class TimeEntriesModule {}
