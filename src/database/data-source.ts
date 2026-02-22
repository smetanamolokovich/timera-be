import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

import { DataSource } from 'typeorm';
import { getDataSourceOptions } from './database.config';

export const AppDataSource = new DataSource(getDataSourceOptions());
