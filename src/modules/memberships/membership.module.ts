import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipOrmEntity } from './infra/membership.orm-entity';
import { MembershipRepositoryImpl } from './infra/membership.repository.impl';
import { REPOSITORY_TOKENS } from '../../common/tokens';

@Module({
  imports: [TypeOrmModule.forFeature([MembershipOrmEntity])],
  providers: [
    {
      provide: REPOSITORY_TOKENS.MembershipRepository,
      useClass: MembershipRepositoryImpl,
    },
  ],
  exports: [REPOSITORY_TOKENS.MembershipRepository],
})
export class MembershipModule {}
