import { ApplicationError } from '../../../../common/errors/application.error';

export class InvalidOrganizationNameError extends ApplicationError {
  statusCode = 400;

  constructor() {
    super('Organization name must be between 2 and 100 characters long.');
  }
}
