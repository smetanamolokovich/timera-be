import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrganizationOrmEntity } from '../../organizations/infra/organization.orm-entity';
import { TimeEntryOrmEntity } from '../../time-entries/infra/time-entry.orm-entiry';
import { WorkTypeOrmEntity } from '../../work-types/infra/work-type.orm-entity';

@Entity('projects')
export class ProjectOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  organizationId!: string;

  @ManyToOne(
    () => OrganizationOrmEntity,
    (organization) => organization.projects,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'organizationId' })
  organization!: OrganizationOrmEntity;

  @Column({
    type: 'varchar',
    length: 50,
  })
  name!: string;

  @Column()
  createdAt!: Date;

  @OneToMany(() => TimeEntryOrmEntity, (timeEntry) => timeEntry.project)
  timeEntries!: TimeEntryOrmEntity[];

  @OneToMany(() => WorkTypeOrmEntity, (workType) => workType.project)
  workTypes!: WorkTypeOrmEntity[];
}
