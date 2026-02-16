import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationOrmEntity } from './infra/organization.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationOrmEntity])],
  providers: [],
  controllers: [],
  exports: [],
})
export class OrganizationsModule {}
