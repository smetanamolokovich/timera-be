import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LoginUserUseCase } from './application/login-user.usecase';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'development_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [LoginUserUseCase],
  exports: [JwtModule],
})
export class AuthModule {}
