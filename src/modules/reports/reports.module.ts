import { Module } from '@nestjs/common';
import { ReportRepositoryImpl } from './infra/report.repository.impl';
import { REPOSITORY_TOKENS } from '../../common/tokens';
import { ReportController } from './presentation/report.controller';
import { GetProjectReportUseCase } from './application/get-project-report.usercase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeEntryOrmEntity } from '../time-entries/infra/time-entry.orm-entity';
import { ProjectModule } from '../projects/project.module';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimeEntryOrmEntity]),
    ProjectModule,
    EmployeesModule,
  ],
  controllers: [ReportController],
  providers: [
    GetProjectReportUseCase,
    {
      provide: REPOSITORY_TOKENS.ReportRepository,
      useClass: ReportRepositoryImpl,
    },
  ],
})
export class ReportsModule {}
