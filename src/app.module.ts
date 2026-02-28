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
import { WorkTypesModule } from './modules/work-types/work-types.module';
import { TimeEntriesModule } from './modules/time-entries/time-entries.module';
import { InvitationsModule } from './modules/invitations/invitations.module';
import { RolesGuard } from './common/guards/roles.guard';

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
    WorkTypesModule,
    TimeEntriesModule,
    InvitationsModule,
  ],
  providers: [RolesGuard],
})
export class AppModule {}
