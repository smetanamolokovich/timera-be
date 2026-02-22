import { Module } from '@nestjs/common';
import { ProjectController } from './presentation/project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectOrmEntity } from './infra/project.orm-entity';
import { CreateProjectUseCase } from './application/create-project.usecase';
import { ProjectRepositoryImpl } from './infra/project.repository.impl';
import { EmployeesModule } from '../employees/employees.module';
import { REPOSITORY_TOKENS } from '../../common/tokens';
@Module({
  imports: [EmployeesModule, TypeOrmModule.forFeature([ProjectOrmEntity])],
  controllers: [ProjectController],
  providers: [
    CreateProjectUseCase,
    {
      provide: REPOSITORY_TOKENS.ProjectRepository,
      useClass: ProjectRepositoryImpl,
    },
  ],
  exports: [REPOSITORY_TOKENS.ProjectRepository],
})
export class ProjectModule {}
