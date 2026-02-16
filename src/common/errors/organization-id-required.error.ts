import { ApplicationError } from './application.error';

export class OrganizationIdRequiredError extends ApplicationError {
  statusCode = 400;

  constructor() {
    super('Organization ID is required to create a project.');
  }
}
