import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterUserUseCase } from './application/register-user.usecase';
import { UserOrmEntity } from './infra/user.orm-entity';
import { UserRepositoryImpl } from './infra/user.repository.impl';
import { UsersController } from './presentation/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UsersController],
  providers: [
    RegisterUserUseCase,
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
  ],
  exports: ['UserRepository'],
})
export class UsersModule {}
