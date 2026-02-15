import { ApplicationError } from '../../../../common/errors/application.error';

export class InvalidProjectNameError extends ApplicationError {
  readonly statusCode = 422;

  constructor() {
    super('Project name must be between 3 and 50 characters long');
  }
}
