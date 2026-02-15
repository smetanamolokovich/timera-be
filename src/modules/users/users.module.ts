import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterUserUseCase } from './application/register-user.usecase';
import { UserOrmEntity } from './infra/user.orm-entity';
import { UserRepositoryImpl } from './infra/user.repository.impl';
import { UsersController } from './presentation/users.controller';
import { BcryptPasswordHasher } from './infra/bcrypt-password-hasher';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UsersController],
  providers: [
    RegisterUserUseCase,
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
    {
      provide: 'PasswordHasher',
      useClass: BcryptPasswordHasher,
    },
  ],
  exports: ['UserRepository', 'PasswordHasher'],
})
export class UsersModule {}
