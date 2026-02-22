import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterUserUseCase } from './application/register-user.usecase';
import { UserOrmEntity } from './infra/user.orm-entity';
import { UserRepositoryImpl } from './infra/user.repository.impl';
import { UsersController } from './presentation/users.controller';
import { BcryptPasswordHasher } from './infra/bcrypt-password-hasher';
import { REPOSITORY_TOKENS, SERVICE_TOKENS } from '../../common/tokens';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UsersController],
  providers: [
    RegisterUserUseCase,
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
