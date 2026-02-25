import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserOrmEntity } from '../../users/infra/user.orm-entity';
import { OrganizationOrmEntity } from '../../organizations/infra/organization.orm-entity';
import { TimeEntryOrmEntity } from '../../time-entries/infra/time-entry.orm-entity';

@Entity('employees')
export class EmployeeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  organizationId!: string;

  @ManyToOne(
    () => OrganizationOrmEntity,
    (organization) => organization.employees,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'organizationId' })
  organization!: OrganizationOrmEntity;

  @Column({ nullable: true })
  userId!: string | null;

  @ManyToOne(() => UserOrmEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user!: UserOrmEntity | null;

  @Column({ length: 100 })
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hourlyRate!: number | null;

  @Column()
  createdAt!: Date;

  @OneToMany(() => TimeEntryOrmEntity, (timeEntry) => timeEntry.employee)
  timeEntries!: TimeEntryOrmEntity[];
}
