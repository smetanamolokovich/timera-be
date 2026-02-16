import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
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

  @OneToMany(() => EmployeeOrmEntity, (employee) => employee.user)
  employees!: EmployeeOrmEntity[];
}
