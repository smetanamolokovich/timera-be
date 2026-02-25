import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
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

  @OneToMany(() => EmployeeOrmEntity, (employee) => employee.user)
  employees!: EmployeeOrmEntity[];

  @OneToMany(() => MembershipOrmEntity, (membership) => membership.user)
  memberships!: MembershipOrmEntity[];
}
