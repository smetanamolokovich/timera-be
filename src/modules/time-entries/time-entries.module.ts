import { Module } from '@nestjs/common';
import { EmployeesModule } from '../employees/employees.module';
import { ProjectModule } from '../projects/project.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeEntryOrmEntity } from './infra/time-entry.orm-entity';
import { TimeEntryRepositoryImpl } from './infra/time-entry.repository.impl';
import { CreateTimeEntryUseCase } from './application/create-time-entry.usecase';
import { GetTimeEntriesByProjectUseCase } from './application/get-time-entries-by-project.usecase';
import { WorkTypesModule } from '../work-types/work-types.module';
import { REPOSITORY_TOKENS } from '../../common/tokens';
import { TimeEntryController } from './presentation/time-entry.controller';

@Module({
  imports: [
    EmployeesModule,
    ProjectModule,
    WorkTypesModule,
    TypeOrmModule.forFeature([TimeEntryOrmEntity]),
  ],
  controllers: [TimeEntryController],
  providers: [
    CreateTimeEntryUseCase,
    GetTimeEntriesByProjectUseCase,
    {
      provide: REPOSITORY_TOKENS.TimeEntryRepository,
      useClass: TimeEntryRepositoryImpl,
    },
  ],
  exports: [REPOSITORY_TOKENS.TimeEntryRepository],
})
export class TimeEntriesModule {}
