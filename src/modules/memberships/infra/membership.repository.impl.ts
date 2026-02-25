import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembershipRepository } from '../domain/interfaces/membership.repository.interface';
import { Membership } from '../domain/membership';
import { MembershipOrmEntity } from './membership.orm-entity';
import { MembershipMapper } from './membership.mapper';

@Injectable()
export class MembershipRepositoryImpl implements MembershipRepository {
  constructor(
    @InjectRepository(MembershipOrmEntity)
    private readonly repo: Repository<MembershipOrmEntity>,
  ) {}

  async save(membership: Membership): Promise<void> {
    const orm = MembershipMapper.fromDomain(membership);
    await this.repo.save(orm);
  }

  async findByUserId(userId: string): Promise<Membership[]> {
    const rows = await this.repo.find({ where: { userId } });
    return rows.map((row) => MembershipMapper.toDomain(row));
  }

  async findByUserAndOrganization(
    userId: string,
    organizationId: string,
  ): Promise<Membership | null> {
    const row = await this.repo.findOne({ where: { userId, organizationId } });
    if (!row) return null;
    return MembershipMapper.toDomain(row);
  }
}
