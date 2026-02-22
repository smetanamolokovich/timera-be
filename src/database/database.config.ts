import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

function getDatabaseConfig(): DataSourceOptions {
  const host = process.env.DB_HOST;
  const port = Number(process.env.DB_PORT);
  const username = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;

  if (!host || !port || !username || !password || !database) {
    throw new Error(
      'Database configuration is incomplete. Please check environment variables.',
    );
  }

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [`${__dirname}/../modules/**/infra/*.orm-entity{.ts,.js}`],
    migrations: [`${__dirname}/../migrations/*.ts`],
    synchronize: false,
  };
}

export function getTypeOrmModuleOptions(): TypeOrmModuleOptions {
  return { ...getDatabaseConfig() };
}

export function getDataSourceOptions(): DataSourceOptions {
  return { ...getDatabaseConfig() };
}
