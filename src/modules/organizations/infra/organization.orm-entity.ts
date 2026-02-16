import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectOrmEntity } from '../../projects/infra/project.orm-entity';
import { EmployeeOrmEntity } from '../../employees/infra/employee.orm-entity';

@Entity('organizations')
export class OrganizationOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column()
  createdAt!: Date;

  @OneToMany(() => ProjectOrmEntity, (project) => project.organization)
  projects!: ProjectOrmEntity[];

  @OneToMany(() => EmployeeOrmEntity, (employee) => employee.organization)
  employees!: EmployeeOrmEntity[];
}
