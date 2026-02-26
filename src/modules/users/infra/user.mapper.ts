import { User } from '../domain/user';
import { UserOrmEntity } from './user.orm-entity';

export class UserMapper {
  static toDomain(entity: UserOrmEntity): User {
    return new User(
      entity.id,
      entity.email,
      entity.passwordHash,
      entity.createdAt,
      entity.updatedAt,
      entity.firstName,
      entity.lastName,
      entity.timezone,
      entity.locale,
      entity.avatarUrl,
      entity.phone,
    );
  }

  static toOrm(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = user.id;
    orm.email = user.email;
    orm.passwordHash = user.getPasswordHash();
    orm.createdAt = user.createdAt;
    orm.updatedAt = user.updatedAt;
    orm.timezone = user.timezone;
    orm.locale = user.locale;
    orm.firstName = user.firstName;
    orm.lastName = user.lastName;
    orm.avatarUrl = user.avatarUrl;
    orm.phone = user.phone;

    return orm;
  }
}
