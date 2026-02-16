import { InvalidOrganizationNameError } from './errors/invalid-organization-name.error';

export class Organization {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt: Date,
  ) {
    if (!name || name.length < 2 || name.length > 100) {
      throw new InvalidOrganizationNameError();
    }
  }
}
