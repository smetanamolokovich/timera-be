import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectModule } from './modules/projects/project.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { getTypeOrmModuleOptions } from './database/database.config';
import { ReportsModule } from './modules/reports/reports.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRoot(getTypeOrmModuleOptions()),
    UsersModule,
    AuthModule,
    ProjectModule,
    EmployeesModule,
    ReportsModule,
    OrganizationsModule,
  ],
})
export class AppModule {}
