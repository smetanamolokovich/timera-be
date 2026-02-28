import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkTypeOrmEntity } from './infra/work-type.orm-entity';
import { WorkTypeRepositoryImpl } from './infra/work-type.repository.impl';
import { REPOSITORY_TOKENS } from '../../common/tokens';
import { GetWorkTypesUseCase } from './application/get-work-types.usecase';
import { CreateWorkTypeUseCase } from './application/create-work-type.usecase';
import { CreateWorkTypesBulkUseCase } from './application/create-work-types-bulk.usecase';
import { WorkTypeController } from './presentation/work-type.controller';
import { ProjectModule } from '../projects/project.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkTypeOrmEntity]), ProjectModule],
  controllers: [WorkTypeController],
  providers: [
    GetWorkTypesUseCase,
    CreateWorkTypeUseCase,
    CreateWorkTypesBulkUseCase,
    {
      provide: REPOSITORY_TOKENS.WorkTypeRepository,
      useClass: WorkTypeRepositoryImpl,
    },
  ],
  exports: [REPOSITORY_TOKENS.WorkTypeRepository],
})
export class WorkTypesModule {}
