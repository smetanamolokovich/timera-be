import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { OrganizationRoleEnum } from '../../memberships/domain/membership';

@Entity('invitations')
export class InvitationOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  organizationId!: string;

  @Column({ type: 'enum', enum: OrganizationRoleEnum })
  role!: OrganizationRoleEnum;

  @Column({ type: 'varchar', unique: true })
  token!: string;

  @Column()
  createdByUserId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;

  @Column({ type: 'varchar', nullable: true })
  invitedEmail?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  usedAt?: Date | null;
}
