import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserOrmEntity } from '../../users/infra/user.orm-entity';

@Entity('projects')
export class ProjectOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => UserOrmEntity, (user) => user.projects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: UserOrmEntity;

  @Column({
    type: 'varchar',
    length: 50,
  })
  name!: string;

  @Column()
  createdAt!: Date;
}
