import { Module } from '@nestjs/common';
import { InvitationOrmEntity } from './infra/invitation.orm-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InvitationController } from './presentation/invitation.controller';
import { MembershipModule } from '../memberships/membership.module';
import { CreateInvitationUseCase } from './application/create-invitation.usecase';
import { GetInvitationByTokenUseCase } from './application/get-invitation-by-token.usecase';
import { AcceptInvitationUseCase } from './application/accept-invitation.usecase';
import { SwitchOrgUseCase } from '../auth/application/switch-org.usecase';
import { REPOSITORY_TOKENS } from '../../common/tokens';
import { InvitationRepositoryImpl } from './infra/invitation.repository.impl';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvitationOrmEntity]),
    MembershipModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [InvitationController],
  providers: [
    CreateInvitationUseCase,
    GetInvitationByTokenUseCase,
    AcceptInvitationUseCase,
    SwitchOrgUseCase,
    {
      provide: REPOSITORY_TOKENS.InvitationRepository,
      useClass: InvitationRepositoryImpl,
    },
  ],
  exports: [AcceptInvitationUseCase],
})
export class InvitationsModule {}
