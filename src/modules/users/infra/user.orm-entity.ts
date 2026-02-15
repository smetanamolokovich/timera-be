import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProjectOrmEntity } from '../../projects/infra/project.orm-entity';
import { EmployeeOrmEntity } from '../../employees/infra/employee.orm-entity';

@Entity('users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  createdAt!: Date;

  @OneToMany(() => ProjectOrmEntity, (project) => project.user)
  projects!: ProjectOrmEntity[];

  @OneToMany(() => EmployeeOrmEntity, (employee) => employee.owner)
  employees!: EmployeeOrmEntity[];
}
