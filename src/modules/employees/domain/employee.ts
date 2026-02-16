import { OrganizationIdRequiredError } from '../../../common/errors/organization-id-required.error';
import { InvalidHourlyRateError } from './errors/invalid-hourly-rate.error';
import { InvalidEmployeeNameError } from './errors/invalid-name.error';

export class Employee {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly name: string,
    public readonly hourlyRate: number | null,
    public readonly createdAt: Date,
  ) {
    if (!name || name.length < 2 || name.length > 100) {
      throw new InvalidEmployeeNameError();
    }

    if (hourlyRate !== null && hourlyRate < 0) {
      throw new InvalidHourlyRateError();
    }

    if (!organizationId) {
      throw new OrganizationIdRequiredError();
    }
  }
}
