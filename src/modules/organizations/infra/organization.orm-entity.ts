import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectOrmEntity } from '../../projects/infra/project.orm-entity';
import { EmployeeOrmEntity } from '../../employees/infra/employee.orm-entity';
import { UserOrmEntity } from '../../users/infra/user.orm-entity';
import { MembershipOrmEntity } from '../../memberships/infra/membership.orm-entity';

@Entity('organizations')
export class OrganizationOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column()
  ownerId!: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'ownerId' })
  owner!: UserOrmEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => ProjectOrmEntity, (project) => project.organization)
  projects!: ProjectOrmEntity[];

  @OneToMany(() => EmployeeOrmEntity, (employee) => employee.organization)
  employees!: EmployeeOrmEntity[];

  @OneToMany(() => MembershipOrmEntity, (membership) => membership.organization)
  memberships!: MembershipOrmEntity[];

  @Column({ type: 'varchar', length: 200, nullable: true })
  address?: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber?: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string | null;

  @Column({ type: 'varchar', nullable: true })
  logoUrl?: string | null;

  @Column({ default: true })
  isActive!: boolean;
}
