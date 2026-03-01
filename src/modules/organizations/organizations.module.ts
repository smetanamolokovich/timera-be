import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationOrmEntity } from './infra/organization.orm-entity';
import { OrganizationRepositoryImpl } from './infra/organization.repository.impl';
import { CreateOrganizationUseCase } from './application/create-organiztion.usercase';
import { GetCurrentOrganizationUseCase } from './application/get-current-organization.usecase';
import { OrganizationController } from './presentation/organization.controller';
import { REPOSITORY_TOKENS } from '../../common/tokens';
import { UsersModule } from '../users/users.module';
import { MembershipModule } from '../memberships/membership.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationOrmEntity]),
    UsersModule,
    MembershipModule,
  ],
  providers: [
    {
      provide: REPOSITORY_TOKENS.OrganizationRepository,
      useClass: OrganizationRepositoryImpl,
    },
    CreateOrganizationUseCase,
    GetCurrentOrganizationUseCase,
  ],
  controllers: [OrganizationController],
  exports: [REPOSITORY_TOKENS.OrganizationRepository],
})
export class OrganizationsModule {}
