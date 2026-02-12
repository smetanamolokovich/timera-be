import { User } from '../domain/user';
import { UserResponseDto } from '../presentation/dto/user-response.dto';
import { UserOrmEntity } from './user.orm-entity';

export class UserMapper {
  static toDomain(entity: UserOrmEntity): User {
    return new User(
      entity.id,
      entity.email,
      entity.passwordHash,
      entity.createdAt,
    );
  }

  static toOrm(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = user.id;
    orm.email = user.email;
    orm.passwordHash = user.getPasswordHash();
    orm.createdAt = user.createdAt;

    return orm;
  }

  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
