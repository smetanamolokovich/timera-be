import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkTypeOrmEntity } from './infra/work-type.orm-entity';
import { WorkTypeRepositoryImpl } from './infra/work-type.repository.impl';
import { REPOSITORY_TOKENS } from '../../common/tokens';

@Module({
  imports: [TypeOrmModule.forFeature([WorkTypeOrmEntity])],
  controllers: [],
  providers: [
    {
      provide: REPOSITORY_TOKENS.WorkTypeRepository,
      useClass: WorkTypeRepositoryImpl,
    },
  ],
  exports: [REPOSITORY_TOKENS.WorkTypeRepository],
})
export class WorkTypesModule {}
