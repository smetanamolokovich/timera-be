import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterUserUseCase } from './application/register-user.usecase';
import { GetMeUseCase } from './application/get-me.usecase';
import { UpdateMeUseCase } from './application/update-me.usecase';
import { UserOrmEntity } from './infra/user.orm-entity';
import { UserRepositoryImpl } from './infra/user.repository.impl';
import { UsersController } from './presentation/users.controller';
import { BcryptPasswordHasher } from './infra/bcrypt-password-hasher';
import { REPOSITORY_TOKENS, SERVICE_TOKENS } from '../../common/tokens';
import { InvitationsModule } from '../invitations/invitations.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity]), InvitationsModule],
  controllers: [UsersController],
  providers: [
    RegisterUserUseCase,
    GetMeUseCase,
    UpdateMeUseCase,
    {
      provide: REPOSITORY_TOKENS.UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: SERVICE_TOKENS.PasswordHasher,
      useClass: BcryptPasswordHasher,
    },
  ],
  exports: [REPOSITORY_TOKENS.UserRepository, SERVICE_TOKENS.PasswordHasher],
})
export class UsersModule {}
