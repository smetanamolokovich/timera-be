import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserOrmEntity } from '../../users/infra/user.orm-entity';

@Entity('employees')
export class EmployeeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  ownerUserId!: string;

  @ManyToOne(() => UserOrmEntity, (user) => user.employees, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ownerUserId' })
  owner!: UserOrmEntity;

  @Column({ length: 100 })
  name!: string;

  @Column({ type: 'decimal', nullable: true })
  hourlyRate!: number | null;

  @Column()
  createdAt!: Date;
}
