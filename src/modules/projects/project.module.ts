import { Module } from '@nestjs/common';
import { ProjectController } from './presentation/project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectOrmEntity } from './infra/project.orm-entity';
import { CreateProjectUseCase } from './application/create-project.usecase';
import { ProjectRepositoryImpl } from './infra/project.repository.impl';
import { GetProjectByUserIdUseCase } from './application/get-project-by-user-id.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectOrmEntity])],
  controllers: [ProjectController],
  providers: [
    CreateProjectUseCase,
    GetProjectByUserIdUseCase,
    {
      provide: 'ProjectRepository',
      useClass: ProjectRepositoryImpl,
    },
  ],
})
export class ProjectModule {}
