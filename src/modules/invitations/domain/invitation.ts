import { OrganizationRoleEnum } from '../../memberships/domain/membership';

export class Invitation {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly role: OrganizationRoleEnum,
    public readonly token: string,
    public readonly expiresAt: Date,
    public readonly createdByUserId: string,
    public readonly createdAt: Date,
    public readonly invitedEmail?: string,
    public readonly usedAt?: Date,
  ) {}

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isUsed(): boolean {
    return !!this.usedAt;
  }

  canBeUsed(): boolean {
    return !this.isExpired() && !this.isUsed();
  }
}
