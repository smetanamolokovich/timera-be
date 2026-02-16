import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProjectOrmEntity } from '../../projects/infra/project.orm-entity';

@Entity('work_types')
export class WorkTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  projectId!: string;

  @ManyToOne(() => ProjectOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project!: ProjectOrmEntity;

  @Column({ length: 100 })
  name!: string;

  @Column()
  createdAt!: Date;
}
