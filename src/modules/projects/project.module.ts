import { Module } from '@nestjs/common';
import { ProjectController } from './presentation/project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectOrmEntity } from './infra/project.orm-entity';
import { CreateProjectUseCase } from './application/create-project.usecase';
import { UpdateProjectUseCase } from './application/update-project.usecase';
import { ProjectRepositoryImpl } from './infra/project.repository.impl';
import { EmployeesModule } from '../employees/employees.module';
import { REPOSITORY_TOKENS } from '../../common/tokens';
import { GetProjectsUseCase } from './application/get-projects.usecase';
import { DeleteProjectUseCase } from './application/delete-project.usecase';
import { GetProjectByIdUseCase } from './application/get-project-by-id.usecase';
@Module({
  imports: [EmployeesModule, TypeOrmModule.forFeature([ProjectOrmEntity])],
  controllers: [ProjectController],
  providers: [
    CreateProjectUseCase,
    GetProjectsUseCase,
    DeleteProjectUseCase,
    UpdateProjectUseCase,
    GetProjectByIdUseCase,
    {
      provide: REPOSITORY_TOKENS.ProjectRepository,
      useClass: ProjectRepositoryImpl,
    },
  ],
  exports: [REPOSITORY_TOKENS.ProjectRepository],
})
export class ProjectModule {}
