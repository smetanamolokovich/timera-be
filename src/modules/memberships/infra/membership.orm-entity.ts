import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserOrmEntity } from '../../users/infra/user.orm-entity';
import { OrganizationOrmEntity } from '../../organizations/infra/organization.orm-entity';
import { OrganizationRoleEnum } from '../domain/membership';

@Entity('memberships')
export class MembershipOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => UserOrmEntity, (user) => user.memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: UserOrmEntity;

  @Column()
  organizationId!: string;

  @ManyToOne(
    () => OrganizationOrmEntity,
    (organization) => organization.memberships,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'organizationId' })
  organization!: OrganizationOrmEntity;

  @Column({ type: 'enum', enum: OrganizationRoleEnum })
  role!: OrganizationRoleEnum;

  @CreateDateColumn()
  createdAt!: Date;
}
