import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../domain/user.repository';
import { UserOrmEntity } from './user.orm-entity';
import { Repository } from 'typeorm';
import { User } from '../domain/user';
import { UserMapper } from './user.mapper';

export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {}

  async save(user: User): Promise<void> {
    const orm = UserMapper.toOrm(user);
    await this.userRepository.save(orm);
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.userRepository.findOne({ where: { email } });

    if (!row) return null;

    return UserMapper.toDomain(row);
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.userRepository.findOne({ where: { id } });

    if (!row) return null;

    return UserMapper.toDomain(row);
  }
}
