export type OrganizationRole = 'OWNER' | 'MANAGER' | 'MEMBER';

export class Membership {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly role: OrganizationRole,
    public readonly createdAt: Date,
  ) {}
}
