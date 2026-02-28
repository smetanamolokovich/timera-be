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

@Module({
  imports: [
    UsersModule,
    MembershipModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [LoginUserUseCase, SwitchOrgUseCase, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
