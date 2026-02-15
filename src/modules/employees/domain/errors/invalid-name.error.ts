import { ApplicationError } from '../../../../common/errors/application.error';

export class InvalidEmployeeNameError extends ApplicationError {
  readonly statusCode = 422;

  constructor() {
    super('Name must be between 2 and 100 characters long');
  }
}
