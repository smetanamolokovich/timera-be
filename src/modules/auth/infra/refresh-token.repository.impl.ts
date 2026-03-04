import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenRepository } from '../domain/refresh-token.repository.interface';
import { RefreshToken } from '../domain/refresh-token';
import { RefreshTokenOrmEntity } from './refresh-token.orm-entity';
import { RefreshTokenMapper } from './refresh-token.mapper';

@Injectable()
export class RefreshTokenRepositoryImpl implements RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenOrmEntity)
    private readonly repo: Repository<RefreshTokenOrmEntity>,
  ) {}

  async save(token: RefreshToken): Promise<void> {
    await this.repo.save(RefreshTokenMapper.toOrm(token));
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const entity = await this.repo.findOne({ where: { token } });
    return entity ? RefreshTokenMapper.toDomain(entity) : null;
  }

  async revokeByToken(token: string): Promise<void> {
    await this.repo.update({ token }, { revokedAt: new Date() });
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    await this.repo.update({ userId }, { revokedAt: new Date() });
  }
}
