import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordResetTokenRepository } from '../domain/password-reset-token.repository.interface';
import { PasswordResetToken } from '../domain/password-reset-token';
import { PasswordResetTokenOrmEntity } from './password-reset-token.orm-entity';
import { PasswordResetTokenMapper } from './password-reset-token.mapper';

@Injectable()
export class PasswordResetTokenRepositoryImpl
  implements PasswordResetTokenRepository
{
  constructor(
    @InjectRepository(PasswordResetTokenOrmEntity)
    private readonly repo: Repository<PasswordResetTokenOrmEntity>,
  ) {}

  async save(token: PasswordResetToken): Promise<void> {
    await this.repo.save(PasswordResetTokenMapper.toOrm(token));
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    const entity = await this.repo.findOne({ where: { token } });
    return entity ? PasswordResetTokenMapper.toDomain(entity) : null;
  }

  async update(token: PasswordResetToken): Promise<void> {
    // TypeORM's save handles both insert and update by matching on the primary key
    await this.save(token);
  }
}
