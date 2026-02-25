import { InvalidOrganizationNameError } from './errors/invalid-organization-name.error';

export class Organization {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly ownerId: string,
    public readonly updatedAt: Date,
    public readonly createdAt: Date,
    public readonly address?: string,
    public readonly phoneNumber?: string,
    public readonly email?: string,
    public readonly logoUrl?: string,
    public readonly isActive: boolean = true,
  ) {
    if (!name || name.length < 2 || name.length > 100) {
      throw new InvalidOrganizationNameError();
    }
  }
}
