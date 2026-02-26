import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmployeeOrmEntity } from '../../employees/infra/employee.orm-entity';
import { MembershipOrmEntity } from '../../memberships/infra/membership.orm-entity';

@Entity('users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => EmployeeOrmEntity, (employee) => employee.user)
  employees!: EmployeeOrmEntity[];

  @OneToMany(() => MembershipOrmEntity, (membership) => membership.user)
  memberships!: MembershipOrmEntity[];

  @Column({ type: 'varchar' })
  firstName!: string;

  @Column({ type: 'varchar' })
  lastName!: string;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  timezone?: string;

  @Column({ type: 'varchar', nullable: true })
  locale?: string;

  @Column({ type: 'varchar', nullable: true })
  phone?: string;
}
