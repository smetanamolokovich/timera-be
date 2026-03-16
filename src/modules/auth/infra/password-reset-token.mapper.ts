import { PasswordResetToken } from '../domain/password-reset-token';
import { PasswordResetTokenOrmEntity } from './password-reset-token.orm-entity';

export class PasswordResetTokenMapper {
  static toDomain(entity: PasswordResetTokenOrmEntity): PasswordResetToken {
    return new PasswordResetToken(
      entity.id,
      entity.userId,
      entity.token,
      entity.expiresAt,
      entity.createdAt,
      entity.usedAt ?? null,
    );
  }

  static toOrm(domain: PasswordResetToken): PasswordResetTokenOrmEntity {
    const entity = new PasswordResetTokenOrmEntity();
    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.token = domain.token;
    entity.expiresAt = domain.expiresAt;
    entity.createdAt = domain.createdAt;
    entity.usedAt = domain.usedAt ?? null;
    return entity;
  }
}
