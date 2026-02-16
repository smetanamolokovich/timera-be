import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployeeOrmEntity } from '../../employees/infra/employee.orm-entity';
import { ProjectOrmEntity } from '../../projects/infra/project.orm-entity';
import { WorkTypeOrmEntity } from '../../work-types/infra/work-type.orm-entity';

@Entity('time_entries')
export class TimeEntryOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  employeeId!: string;

  @ManyToOne(() => EmployeeOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeId' })
  employee!: EmployeeOrmEntity;

  @Column()
  projectId!: string;

  @ManyToOne(() => ProjectOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project!: ProjectOrmEntity;

  @Column()
  workTypeId!: string;

  @ManyToOne(() => WorkTypeOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workTypeId' })
  workType!: WorkTypeOrmEntity;

  @Column({ length: 255 })
  description!: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  hours!: number;

  @Column({ type: 'date' })
  date!: Date;

  @Column()
  createdAt!: Date;
}
