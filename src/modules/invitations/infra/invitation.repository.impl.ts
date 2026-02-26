import { Injectable } from '@nestjs/common';
import { Invitation } from '../domain/invitation';
import { InjectRepository } from '@nestjs/typeorm';
import { InvitationOrmEntity } from './invitation.orm-entity';
import { Repository } from 'typeorm';
import { InvitationMapper } from './invitation.mapper';
import type { InvitationRepository } from '../domain/interfaces/invitation.repository';

@Injectable()
export class InvitationRepositoryImpl implements InvitationRepository {
  constructor(
    @InjectRepository(InvitationOrmEntity)
    private readonly invitationRepository: Repository<InvitationOrmEntity>,
  ) {}

  async save(invitation: Invitation): Promise<void> {
    const ormEntity = InvitationMapper.toOrm(invitation);
    await this.invitationRepository.save(ormEntity);
  }

  async findByToken(token: string): Promise<Invitation | null> {
    const ormEntity = await this.invitationRepository.findOne({
      where: { token },
    });

    if (!ormEntity) return null;

    return InvitationMapper.toDomain(ormEntity);
  }

  async findById(id: string): Promise<Invitation | null> {
    const ormEntity = await this.invitationRepository.findOne({
      where: { id },
    });

    if (!ormEntity) return null;

    return InvitationMapper.toDomain(ormEntity);
  }

  async markAsUsed(id: string, usedAt: Date): Promise<void> {
    await this.invitationRepository.update(id, { usedAt });
  }
}
