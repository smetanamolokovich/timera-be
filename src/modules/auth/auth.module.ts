import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginUserUseCase } from './application/login-user.usecase';
import { SwitchOrgUseCase } from './application/switch-org.usecase';
import { JwtStrategy } from './infra/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './presentation/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { MembershipModule } from '../memberships/membership.module';
import { RefreshTokenOrmEntity } from './infra/refresh-token.orm-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenRepositoryImpl } from './infra/refresh-token.repository.impl';
import { REPOSITORY_TOKENS } from '../../common/tokens';
import { RefreshTokenUseCase } from './application/refresh-token.usecase';
import { LogoutUseCase } from './application/logout.usecase';
import { ForgotPasswordUseCase } from './application/forgot-password.usecase';
import { ResetPasswordUseCase } from './application/reset-password.usecase';
import { PasswordResetTokenOrmEntity } from './infra/password-reset-token.orm-entity';
import { PasswordResetTokenRepositoryImpl } from './infra/password-reset-token.repository.impl';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshTokenOrmEntity, PasswordResetTokenOrmEntity]),
    UsersModule,
    MembershipModule,
    PassportModule,
    EmailModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUserUseCase,
    SwitchOrgUseCase,
    JwtStrategy,
    RefreshTokenUseCase,
    LogoutUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    {
      provide: REPOSITORY_TOKENS.RefreshTokenRepository,
      useClass: RefreshTokenRepositoryImpl,
    },
    {
      provide: REPOSITORY_TOKENS.PasswordResetTokenRepository,
      useClass: PasswordResetTokenRepositoryImpl,
    },
  ],
  exports: [JwtModule],
})
export class AuthModule {}
