import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from '../domain/interfaces/organization.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationOrmEntity } from './organization.orm-entity';
import { Repository } from 'typeorm';
import { OrganizationMapper } from './organization.mapper';
import { Organization } from '../domain/organization';

@Injectable()
export class OrganizationRepositoryImpl implements OrganizationRepository {
  constructor(
    @InjectRepository(OrganizationOrmEntity)
    private readonly organizationRepository: Repository<OrganizationOrmEntity>,
  ) {}

  async save(organization: Organization): Promise<void> {
    const orm = OrganizationMapper.fromDomain(organization);

    await this.organizationRepository.save(orm);
  }

  async findById(id: string): Promise<Organization | null> {
    const orm = await this.organizationRepository.findOne({ where: { id } });
    if (!orm) return null;
    return OrganizationMapper.toDomain(orm);
  }
}
