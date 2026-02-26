export enum OrganizationRoleEnum {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
}

export class Membership {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly role: OrganizationRoleEnum,
    public readonly createdAt: Date,
  ) {}
}
