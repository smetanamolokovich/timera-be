import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LoginUserUseCase } from './application/login-user.usecase';
import { JwtStrategy } from './infra/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'development_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [LoginUserUseCase, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
