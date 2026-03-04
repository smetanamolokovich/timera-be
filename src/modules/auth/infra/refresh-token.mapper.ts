import { RefreshToken } from '../domain/refresh-token';
import { RefreshTokenOrmEntity } from './refresh-token.orm-entity';

export class RefreshTokenMapper {
  static toDomain(entity: RefreshTokenOrmEntity): RefreshToken {
    return new RefreshToken(
      entity.id,
      entity.userId,
      entity.token,
      entity.expiresAt,
      entity.createdAt,
      entity.revokedAt ?? null,
    );
  }

  static toOrm(domain: RefreshToken): RefreshTokenOrmEntity {
    const entity = new RefreshTokenOrmEntity();
    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.token = domain.token;
    entity.expiresAt = domain.expiresAt;
    entity.createdAt = domain.createdAt;
    entity.revokedAt = domain.revokedAt ?? null;

    return entity;
  }
}
