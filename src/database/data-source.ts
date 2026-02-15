import * as dotenv from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

import { DataSource } from 'typeorm';
import { UserOrmEntity } from '../modules/users/infra/user.orm-entity';
import { ProjectOrmEntity } from '../modules/projects/infra/project.orm-entity';
import { EmployeeOrmEntity } from '../modules/employees/infra/employee.orm-entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [UserOrmEntity, ProjectOrmEntity, EmployeeOrmEntity],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
