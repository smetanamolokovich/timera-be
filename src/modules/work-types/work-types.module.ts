import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkTypeOrmEntity } from './infra/work-type.orm-entity';
import { WorkTypeRepositoryImpl } from './infra/work-type.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([WorkTypeOrmEntity])],
  controllers: [],
  providers: [
    {
      provide: 'WorkTypeRepository',
      useClass: WorkTypeRepositoryImpl,
    },
  ],
  exports: ['WorkTypeRepository'],
})
export class WorkTypesModule {}
