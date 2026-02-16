import { InvalidProjectNameError } from './errors/invalid-project-name.error';
import { OrganizationIdRequiredError } from '../../../common/errors/organization-id-required.error';

export class Project {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public name: string,
    public createdAt: Date,
  ) {
    if (!organizationId) {
      throw new OrganizationIdRequiredError();
    }

    if (!name || name.length < 3 || name.length > 50) {
      throw new InvalidProjectNameError();
    }
  }
}
